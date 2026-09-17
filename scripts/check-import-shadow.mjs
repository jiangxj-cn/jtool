#!/usr/bin/env node
/**
 * 静态一致性检查（无需安装依赖，纯 Node 标准库）
 *
 * 背景：Vue `<script setup>` 的顶层语句会被编译进 setup() 函数体，而 import 提升到模块作用域。
 * 因此 `import { convert } from '@jtool/core'` + `const convert = () => {...}` 不报语法错误，
 * 而是「变量遮蔽」—— 组件内所有 convert(...) 调用都会打到本地函数上，变成自己调用自己：
 *   无限递归 → RangeError(栈溢出) → 上层 try/catch 拿到 undefined → 读 .xxx 抛 TypeError
 * 症状：控制台刷屏 "Cannot read properties of undefined (reading 'outputValue')"，
 *       真正的根因 RangeError 被日志环形缓冲挤掉，极难定位。
 *
 * 本脚本做三件事：
 *   [1] 扫描 web 层「本地声明遮蔽同名导入」
 *   [2] 校验从 @jtool/core 导入的符号是否真实存在
 *   [3] 校验相对导入路径能否解析到真实文件（跨包错误路径会让 rollup 直接构建失败）
 *
 * 用法：node scripts/check-import-shadow.mjs     （任何目录下均可，路径基于脚本自身位置推导）
 * 退出码：0 = 全部通过；1 = 发现问题
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join, relative, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const WEB_SRC = join(REPO, 'packages/web/src')
const CORE_SRC = join(REPO, 'packages/core/src')

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'target'])

function walk(dir, filter) {
  const out = []
  ;(function rec(d) {
    for (const name of readdirSync(d)) {
      if (SKIP_DIRS.has(name)) continue
      const p = join(d, name)
      if (statSync(p).isDirectory()) rec(p)
      else if (filter(p)) out.push(p)
    }
  })(dir)
  return out
}

function resolveModule(fromDir, spec) {
  const cands = [spec, spec + '.ts', spec + '.vue', spec + '.js', join(spec, 'index.ts')]
  for (const c of cands) {
    const p = resolve(fromDir, c)
    if (existsSync(p) && statSync(p).isFile()) return p
  }
  return null
}

const IMPORT_RE = /import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+['"]([^'"]+)['"]/g

function parseImportSpecifiers(body) {
  const names = []
  for (let raw of body.split(',')) {
    // 去掉注释与空白，避免把注释当成符号名
    raw = raw.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '').trim()
    if (!raw) continue
    raw = raw.replace(/^type\s+/, '')
    const as = raw.match(/^(\S+)\s+as\s+(\S+)$/)
    names.push(as ? { original: as[1], local: as[2] } : { original: raw.split(/\s+/)[0], local: raw.split(/\s+/)[0] })
  }
  return names
}

function eachImport(text, cb) {
  IMPORT_RE.lastIndex = 0
  let m
  while ((m = IMPORT_RE.exec(text))) cb(parseImportSpecifiers(m[1]), m[2])
}

/* ── [1] 重名遮蔽 ── */
const webFiles = walk(WEB_SRC, (p) => /\.(vue|ts)$/.test(p))
const DECL_RE = /^(?:export\s+)?(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/gm
const shadowHits = []

for (const f of webFiles) {
  const text = readFileSync(f, 'utf8')
  const importedLocal = new Map()
  eachImport(text, (specs, mod) => specs.forEach((s) => importedLocal.set(s.local, mod)))

  DECL_RE.lastIndex = 0
  let d
  while ((d = DECL_RE.exec(text))) {
    if (importedLocal.has(d[1])) {
      shadowHits.push(`${relative(REPO, f)}: 本地声明 "${d[1]}" 遮蔽了来自 "${importedLocal.get(d[1])}" 的导入`)
    }
  }
}

/* ── 收集 @jtool/core 真实导出 ── */
const coreExports = new Set()
const DIRECT_EXPORT_RE = /^export\s+(?:declare\s+)?(?:const|let|var|function|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/gm
const NAMED_EXPORT_RE = /^export\s+\{([^}]*)\}/gm
const STAR_EXPORT_RE = /^export\s+\*\s+from\s+['"]([^'"]+)['"]/gm

function collectExports(file, depth = 0) {
  if (depth > 4) return
  const text = readFileSync(file, 'utf8')
  let m
  DIRECT_EXPORT_RE.lastIndex = 0
  while ((m = DIRECT_EXPORT_RE.exec(text))) coreExports.add(m[1])
  NAMED_EXPORT_RE.lastIndex = 0
  while ((m = NAMED_EXPORT_RE.exec(text))) {
    parseImportSpecifiers(m[1]).forEach((s) => coreExports.add(s.local))
  }
  STAR_EXPORT_RE.lastIndex = 0
  while ((m = STAR_EXPORT_RE.exec(text))) {
    const target = resolveModule(dirname(file), m[1])
    if (target && !target.endsWith('index.ts')) collectExports(target, depth + 1)
    else if (target) {
      const t = readFileSync(target, 'utf8')
      let mm
      DIRECT_EXPORT_RE.lastIndex = 0
      while ((mm = DIRECT_EXPORT_RE.exec(t))) coreExports.add(mm[1])
      NAMED_EXPORT_RE.lastIndex = 0
      while ((mm = NAMED_EXPORT_RE.exec(t))) parseImportSpecifiers(mm[1]).forEach((s) => coreExports.add(s.local))
    }
  }
}
collectExports(join(CORE_SRC, 'index.ts'))

/* ── [2] 导入符号是否存在 ── */
const badSymbols = []
for (const f of webFiles) {
  eachImport(readFileSync(f, 'utf8'), (specs, mod) => {
    if (mod !== '@jtool/core') return
    for (const s of specs) {
      if (!coreExports.has(s.original)) {
        badSymbols.push(`${relative(REPO, f)}: 导入了 @jtool/core 中不存在的符号 "${s.original}"`)
      }
    }
  })
}

/* ── [3] 相对路径可解析 ── */
const REL_RE = /from\s+['"](\.[^'"]+)['"]/g
const badPaths = []
for (const f of webFiles) {
  const text = readFileSync(f, 'utf8')
  REL_RE.lastIndex = 0
  let m
  while ((m = REL_RE.exec(text))) {
    if (!resolveModule(dirname(f), m[1])) badPaths.push(`${relative(REPO, f)}  →  ${m[1]}`)
  }
}

/* ── 输出 ── */
const show = (title, list, okMsg) => {
  console.log(`\n[${title}]`)
  console.log(list.length ? list.map((x) => '  ✗ ' + x).join('\n') : '  ✓ ' + okMsg)
}

console.log(`检查范围: ${relative(REPO, WEB_SRC)}  (${webFiles.length} 个文件)`)
show('1/3 本地声明遮蔽同名导入', shadowHits, '未发现遮蔽')
show('2/3 @jtool/core 导入符号存在性', badSymbols, `全部存在（core 导出 ${coreExports.size} 个符号）`)
show('3/3 相对导入路径可解析', badPaths, '全部可解析')

const total = shadowHits.length + badSymbols.length + badPaths.length
console.log('\n' + (total === 0 ? '✓ 全部通过' : `✗ 发现 ${total} 个问题`))
process.exit(total === 0 ? 0 : 1)
