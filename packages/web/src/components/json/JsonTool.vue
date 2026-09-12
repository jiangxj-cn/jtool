<template>
  <div class="json-tool-container">
    <!-- 标题栏 -->
    <div class="header">
      <h2>📝 JSON 工具</h2>
      <n-tag :type="isValidJson ? 'success' : 'default'" size="small">
        {{ isValidJson ? '✓ 有效' : (inputJson ? '✗ 无效' : '等待输入') }}
      </n-tag>
    </div>

    <n-card class="main-card">
      <!-- 操作按钮 -->
      <div class="action-bar">
        <n-space justify="space-between">
          <n-space>
            <n-button type="primary" @click="format" :disabled="!inputJson">格式化</n-button>
            <n-button @click="validate" :disabled="!inputJson">校验</n-button>
            <n-button @click="compress" :disabled="!inputJson">压缩</n-button>
            <n-button @click="pasteFromClipboard">粘贴</n-button>
          </n-space>
          <n-space>
            <n-button @click="copyOutput" :disabled="!outputJson">复制</n-button>
            <n-button @click="clearAll">清空</n-button>
          </n-space>
        </n-space>
      </div>

      <!-- Tab 切换 -->
      <n-tabs type="line" v-model:value="activeTab">
        <!-- 基础功能 -->
        <n-tab-pane name="basic" tab="基础功能">
          <div class="editor-container">
            <div class="input-section">
              <n-input
                v-model:value="inputJson"
                type="textarea"
                placeholder="请输入 JSON..."
                :rows="10"
                @input="onInputChanged"
              />
            </div>
            <div class="output-section">
              <n-input
                v-model:value="outputJson"
                type="textarea"
                placeholder="结果..."
                :rows="10"
                readonly
              />
            </div>
          </div>
        </n-tab-pane>

        <!-- 转义工具 -->
        <n-tab-pane name="escape" tab="转义工具">
          <div class="editor-container">
            <div class="input-section">
              <n-input
                v-model:value="inputJson"
                type="textarea"
                placeholder="请输入要转义的内容..."
                :rows="10"
              />
              <n-space style="margin-top: 12px">
                <n-button @click="escapeStr">字符串转义</n-button>
                <n-button @click="unescapeStr">去除转义</n-button>
                <n-button @click="escapeAll">全部转义</n-button>
                <n-button @click="unescapeAll">全部去转义</n-button>
              </n-space>
            </div>
            <div class="output-section">
              <n-input
                v-model:value="outputJson"
                type="textarea"
                placeholder="转义结果..."
                :rows="10"
                readonly
              />
            </div>
          </div>
        </n-tab-pane>

        <!-- JSONPath 查询 -->
        <n-tab-pane name="jsonpath" tab="JSONPath">
          <div class="simple-container">
            <n-input
              v-model:value="inputJson"
              type="textarea"
              placeholder="输入 JSON..."
              :rows="8"
            />
            <n-input
              v-model:value="jsonpathQuery"
              placeholder="输入 JSONPath，如 $.store.book[*].author"
              style="margin-top: 12px"
            />
            <n-space style="margin-top: 12px">
              <n-button type="primary" @click="queryJsonPath">查询</n-button>
            </n-space>
            <n-input
              v-model:value="outputJson"
              type="textarea"
              placeholder="查询结果..."
              :rows="8"
              readonly
              style="margin-top: 12px"
            />
          </div>
        </n-tab-pane>

        <!-- 格式转换 -->
        <n-tab-pane name="convert" tab="格式转换">
          <div class="simple-container">
            <n-input
              v-model:value="inputJson"
              type="textarea"
              placeholder="输入 JSON..."
              :rows="8"
            />
            <n-space style="margin-top: 12px">
              <n-select v-model:value="convertSource" :options="formatOptions" style="width: 120px" />
              <span>→</span>
              <n-select v-model:value="convertTarget" :options="formatOptions" style="width: 120px" />
              <n-button type="primary" @click="convertFormat">转换</n-button>
            </n-space>
            <n-input
              v-model:value="outputJson"
              type="textarea"
              placeholder="转换结果..."
              :rows="8"
              readonly
              style="margin-top: 12px"
            />
          </div>
        </n-tab-pane>

        <!-- 差异比较 -->
        <n-tab-pane name="diff" tab="差异比较">
          <div class="diff-container">
            <n-input
              v-model:value="inputJson1"
              type="textarea"
              placeholder="第一个 JSON..."
              :rows="8"
            />
            <n-input
              v-model:value="inputJson2"
              type="textarea"
              placeholder="第二个 JSON..."
              :rows="8"
              style="margin-top: 12px"
            />
            <n-space style="margin-top: 12px">
              <n-button type="primary" @click="compareJson">比较</n-button>
            </n-space>
            <n-input
              v-model:value="outputJson"
              type="textarea"
              placeholder="差异结果..."
              :rows="8"
              readonly
              style="margin-top: 12px"
            />
          </div>
        </n-tab-pane>
      </n-tabs>

      <!-- 消息提示 -->
      <n-alert v-if="errorMsg" type="error" style="margin-top: 12px" closable @close="errorMsg = ''">
        {{ errorMsg }}
      </n-alert>
      <n-alert v-if="successMsg" type="success" style="margin-top: 12px" closable @close="successMsg = ''">
        {{ successMsg }}
      </n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import JSON5 from 'json5'
import { NCard, NInput, NButton, NSpace, NAlert, NTabs, NTabPane, NTag, NSelect } from 'naive-ui'

const activeTab = ref('basic')
const inputJson = ref('')
const inputJson1 = ref('')
const inputJson2 = ref('')
const outputJson = ref('')
const errorMsg = ref('')
const successMsg = ref('')
const isValidJson = ref(false)

// JSONPath
const jsonpathQuery = ref('')

// 格式转换
const convertSource = ref('json')
const convertTarget = ref('yaml')
const formatOptions = [
  { label: 'JSON', value: 'json' },
  { label: 'YAML', value: 'yaml' },
  { label: 'XML', value: 'xml' },
  { label: 'CSV', value: 'csv' },
]

// 实时校验
watch(inputJson, (val) => {
  if (!val) {
    isValidJson.value = false
    return
  }
  try {
    JSON5.parse(val)
    isValidJson.value = true
  } catch {
    isValidJson.value = false
  }
})

const clearError = () => {
  errorMsg.value = ''
  successMsg.value = ''
}

// 基础功能
const format = () => {
  clearError()
  try {
    const obj = JSON5.parse(inputJson.value)
    outputJson.value = JSON.stringify(obj, null, 2)
    successMsg.value = '✓ 格式化成功'
  } catch (e) {
    errorMsg.value = `格式化失败：${(e as Error).message}`
  }
}

const validate = () => {
  clearError()
  try {
    JSON5.parse(inputJson.value)
    successMsg.value = '✓ JSON 格式正确'
  } catch (e) {
    errorMsg.value = `无效 JSON: ${(e as Error).message}`
  }
}

const compress = () => {
  clearError()
  try {
    const obj = JSON5.parse(inputJson.value)
    outputJson.value = JSON.stringify(obj)
    successMsg.value = '✓ 压缩成功'
  } catch (e) {
    errorMsg.value = `压缩失败：${(e as Error).message}`
  }
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputJson.value = text
  } catch {
    errorMsg.value = '无法读取剪贴板'
  }
}

const copyOutput = async () => {
  if (outputJson.value) {
    await navigator.clipboard.writeText(outputJson.value)
    successMsg.value = '✓ 已复制'
  }
}

const clearAll = () => {
  inputJson.value = ''
  inputJson1.value = ''
  inputJson2.value = ''
  outputJson.value = ''
  jsonpathQuery.value = ''
  clearError()
}

const onInputChanged = (value: string) => {
  if (!value) {
    isValidJson.value = false
    return
  }
  try {
    JSON5.parse(value)
    isValidJson.value = true
  } catch {
    isValidJson.value = false
  }
}

// 转义工具
const escapeStr = () => {
  clearError()
  try {
    outputJson.value = JSON.stringify(inputJson.value)
    successMsg.value = '✓ 字符串转义成功'
  } catch (e) {
    errorMsg.value = `转义失败：${(e as Error).message}`
  }
}

const unescapeStr = () => {
  clearError()
  try {
    outputJson.value = JSON.parse(inputJson.value)
    successMsg.value = '✓ 去除转义成功'
  } catch (e) {
    errorMsg.value = `去转义失败：${(e as Error).message}`
  }
}

const escapeAll = () => {
  clearError()
  outputJson.value = inputJson.value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
  successMsg.value = '✓ 全部转义成功'
}

const unescapeAll = () => {
  clearError()
  outputJson.value = inputJson.value
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\')
  successMsg.value = '✓ 全部去转义成功'
}

// JSONPath 查询（自实现，无外部依赖）
const queryJsonPath = () => {
  clearError()
  try {
    const obj = JSON5.parse(inputJson.value)
    const res = evalJsonPath(obj, jsonpathQuery.value)
    if (res.error) {
      errorMsg.value = `查询失败：${res.error}`
      return
    }
    if (res.values.length === 0) {
      outputJson.value = '未找到匹配的结果'
      successMsg.value = '✓ 查询完成，匹配 0 项'
      return
    }
    outputJson.value = JSON.stringify(res.values.length === 1 ? res.values[0] : res.values, null, 2)
    successMsg.value = `✓ 查询完成，匹配 ${res.values.length} 项`
  } catch (e) {
    errorMsg.value = `查询失败：${(e as Error).message}`
  }
}

// 格式转换（自实现，无外部依赖）
const convertFormat = () => {
  clearError()
  try {
    const source = convertSource.value
    const target = convertTarget.value
    const text = inputJson.value
    if (!text.trim()) {
      errorMsg.value = '请输入要转换的内容'
      return
    }
    if (source === target) {
      outputJson.value = text
      successMsg.value = '✓ 源格式与目标格式相同'
      return
    }
    const res = convertBetween(source, target, text)
    if (!res.ok) {
      errorMsg.value = `转换失败：${res.error}`
      return
    }
    outputJson.value = res.result ?? ''
    successMsg.value = `✓ 已转换为 ${target.toUpperCase()}`
  } catch (e) {
    errorMsg.value = `转换失败：${(e as Error).message}`
  }
}

// 差异比较（自实现，无外部依赖）
const compareJson = () => {
  clearError()
  try {
    const obj1 = JSON5.parse(inputJson1.value)
    const obj2 = JSON5.parse(inputJson2.value)
    const s1 = canonicalJSON(obj1)
    const s2 = canonicalJSON(obj2)
    if (s1 === s2) {
      outputJson.value = '✅ 两个 JSON 完全相同'
      successMsg.value = '✓ 完全相同'
      return
    }
    outputJson.value = lineDiff(s1, s2)
    errorMsg.value = '发现差异'
  } catch (e) {
    errorMsg.value = `比较失败：${(e as Error).message}`
  }
}

// ===== JSONPath 求值器（支持 $ .key [*] [n] [?(过滤)] $..递归 [a,b]）=====
interface JsonPathOut { values: any[]; error?: string }

function evalJsonPath(root: any, path: string): JsonPathOut {
  if (!path || !path.trim()) return { values: [], error: '请输入 JSONPath 表达式' }
  if (path[0] !== '$') return { values: [], error: 'JSONPath 必须以 $ 开头' }
  let nodes: any[] = [root]
  let i = 1
  while (i < path.length) {
    const c = path[i]
    if (c === '.') {
      if (path[i + 1] === '[') {
        // 点号后紧跟方括号（如 $[*].[a,b]），跳过点号交给方括号处理
        i++
        continue
      }
      if (path[i + 1] === '.') {
        // 递归下降 $..key
        i += 2
        let name = ''
        while (i < path.length && /[A-Za-z0-9_@]/.test(path[i])) { name += path[i]; i++ }
        const next: any[] = []
        const collect = (cur: any) => {
          if (cur && typeof cur === 'object') {
            if (Array.isArray(cur)) cur.forEach(collect)
            else {
              if (name in cur) next.push(cur[name])
              Object.values(cur).forEach(collect)
            }
          }
        }
        nodes.forEach(collect)
        nodes = next
        continue
      }
      i++
      let name = ''
      while (i < path.length && /[A-Za-z0-9_]/.test(path[i])) { name += path[i]; i++ }
      nodes = nodes
        .map(n => (n && typeof n === 'object' && name in n) ? n[name] : undefined)
        .filter(v => v !== undefined)
      continue
    }
    if (c === '[') {
      const end = path.indexOf(']', i)
      if (end === -1) return { values: [], error: '括号不匹配' }
      const inner = path.slice(i + 1, end).trim()
      i = end + 1
      if (inner === '*') {
        const next: any[] = []
        nodes.forEach(n => {
          if (Array.isArray(n)) n.forEach(v => next.push(v))
          else if (n && typeof n === 'object') Object.values(n).forEach(v => next.push(v))
        })
        nodes = next
      } else if (inner.startsWith('?')) {
        let expr = inner.slice(1).trim()
        expr = expr.replace(/^\(/, '').replace(/\)$/, '')
        const m = expr.match(/^@\.([A-Za-z0-9_]+)\s*(<=|>=|==|!=|<|>)\s*(.+)$/)
        if (!m) return { values: [], error: '不支持的过滤表达式' }
        const key = m[1]
        const op = m[2]
        let val: any = m[3].trim()
        if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) val = val.slice(1, -1)
        else if (val === 'true') val = true
        else if (val === 'false') val = false
        else if (val === 'null') val = null
        else if (!isNaN(Number(val))) val = Number(val)
        const next: any[] = []
        nodes.forEach(n => {
          if (Array.isArray(n)) n.forEach(item => { if (matchFilter(item, key, op, val)) next.push(item) })
          else if (n && typeof n === 'object' && matchFilter(n, key, op, val)) next.push(n)
        })
        nodes = next
      } else if (/^[0-9]+$/.test(inner)) {
        const idx = parseInt(inner, 10)
        nodes = nodes.map(n => (Array.isArray(n) ? n[idx] : undefined)).filter(v => v !== undefined)
      } else if (inner.includes(',')) {
        const props = inner.split(',').map(s => s.trim()).filter(Boolean)
        const next: any[] = []
        nodes.forEach(n => {
          if (n && typeof n === 'object') {
            const o: any = {}
            props.forEach(p => { if (p in n) o[p] = n[p] })
            next.push(o)
          }
        })
        nodes = next
      } else {
        return { values: [], error: `不支持的索引表达式: ${inner}` }
      }
      continue
    }
    i++
  }
  return { values: nodes }
}

function matchFilter(item: any, key: string, op: string, val: any): boolean {
  if (!item || typeof item !== 'object' || !(key in item)) return false
  const left = item[key]
  switch (op) {
    case '<': return left < val
    case '>': return left > val
    case '<=': return left <= val
    case '>=': return left >= val
    case '==': return left == val
    case '!=': return left != val
  }
  return false
}

// ===== 差异比较辅助 =====
function sortKeys(o: any): any {
  if (Array.isArray(o)) return o.map(sortKeys)
  if (o && typeof o === 'object') {
    const r: any = {}
    Object.keys(o).sort().forEach(k => { r[k] = sortKeys(o[k]) })
    return r
  }
  return o
}

function canonicalJSON(obj: any): string {
  return JSON.stringify(sortKeys(obj), null, 2)
}

function lineDiff(a: string, b: string): string {
  const A = a.split('\n')
  const B = b.split('\n')
  const n = A.length
  const m = B.length
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }
  const out: string[] = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (A[i] === B[j]) { out.push('  ' + A[i]); i++; j++ }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push('- ' + A[i]); i++ }
    else { out.push('+ ' + B[j]); j++ }
  }
  while (i < n) { out.push('- ' + A[i]); i++ }
  while (j < m) { out.push('+ ' + B[j]); j++ }
  return out.join('\n')
}

// ===== 格式转换辅助 =====
interface ConvertOut { ok: boolean; result?: string; error?: string }

function convertBetween(src: string, tgt: string, text: string): ConvertOut {
  try {
    if (src === 'json') {
      const obj = JSON5.parse(text)
      if (tgt === 'yaml') return { ok: true, result: toYaml(obj) }
      if (tgt === 'xml') return { ok: true, result: toXml(obj) }
      if (tgt === 'csv') return { ok: true, result: toCsv(obj) }
    }
    if (src === 'yaml' && tgt === 'json') return { ok: true, result: JSON.stringify(parseYaml(text), null, 2) }
    if (src === 'xml' && tgt === 'json') return { ok: true, result: JSON.stringify(xmlToObj(text), null, 2) }
    if (src === 'csv' && tgt === 'json') return { ok: true, result: JSON.stringify(parseCsv(text), null, 2) }
    return { ok: false, error: '暂不支持该转换方向（目前支持 JSON 与各格式互转）' }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

function toYaml(obj: any, indent = 0): string {
  const pad = '  '.repeat(indent)
  if (obj === null || obj === undefined) return pad + 'null'
  if (typeof obj !== 'object') return pad + yamlScalar(obj)
  if (Array.isArray(obj)) {
    if (obj.length === 0) return pad + '[]'
    return obj.map(item => {
      if (item !== null && typeof item === 'object') {
        const sub = toYaml(item, indent + 1)
        const lines = sub.split('\n')
        lines[0] = pad + '- ' + lines[0].slice((indent + 1) * 2)
        return lines.join('\n')
      }
      return pad + '- ' + yamlScalar(item)
    }).join('\n')
  }
  const keys = Object.keys(obj)
  if (keys.length === 0) return pad + '{}'
  return keys.map(k => {
    const v = obj[k]
    if (v !== null && typeof v === 'object') {
      return pad + k + ':\n' + toYaml(v, indent + 1)
    }
    return pad + k + ': ' + yamlScalar(v)
  }).join('\n')
}

function yamlScalar(v: any): string {
  if (typeof v === 'string') {
    return /[:#{}[\],&*?|<>=!%@`"' ]/.test(v) || v === '' ? JSON.stringify(v) : v
  }
  return String(v)
}

function toXml(obj: any): string {
  const build = (o: any): string => {
    if (o === null || o === undefined) return ''
    if (typeof o !== 'object') return escapeXml(String(o))
    if (Array.isArray(o)) return o.map(item => `<item>${build(item)}</item>`).join('')
    return Object.entries(o).map(([k, v]) => `<${k}>${build(v)}</${k}>`).join('')
  }
  let rootName = 'root'
  let content: any = obj
  if (!Array.isArray(obj) && obj && typeof obj === 'object' && Object.keys(obj).length === 1) {
    rootName = Object.keys(obj)[0]
    content = obj[rootName]
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n  ${build(content)}\n</${rootName}>`
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function xmlToObj(text: string): any {
  const cleaned = text.replace(/<\?xml[^>]*\?>/, '').replace(/<!--[\s\S]*?-->/g, '').trim()
  let i = 0
  function parse(): any {
    const childMap: Record<string, any> = {}
    let textContent = ''
    while (i < cleaned.length) {
      if (cleaned[i] === '<') {
        if (cleaned[i + 1] === '/') {
          const end = cleaned.indexOf('>', i)
          i = end + 1
          break
        }
        const end = cleaned.indexOf('>', i)
        const tagName = cleaned.slice(i + 1, end).split(/\s/)[0]
        i = end + 1
        const val = parse()
        if (Object.prototype.hasOwnProperty.call(childMap, tagName)) {
          if (!Array.isArray(childMap[tagName])) childMap[tagName] = [childMap[tagName]]
          childMap[tagName].push(val)
        } else {
          childMap[tagName] = val
        }
      } else {
        let end = cleaned.indexOf('<', i)
        if (end === -1) end = cleaned.length
        textContent += cleaned.slice(i, end)
        i = end
      }
    }
    if (Object.keys(childMap).length > 0) {
      // 约定：唯一子键为 item 时表示数组（<item> 为数组元素包裹标签）
      if (Object.keys(childMap).length === 1 && Object.prototype.hasOwnProperty.call(childMap, 'item')) {
        return Array.isArray(childMap.item) ? childMap.item : [childMap.item]
      }
      return childMap
    }
    const t = textContent.trim()
    if (t === '') return null
    if (!isNaN(Number(t))) return Number(t)
    if (t === 'true') return true
    if (t === 'false') return false
    return t
  }
  return parse()
}

function toCsv(obj: any): string {
  const arr = Array.isArray(obj) ? obj : [obj]
  if (arr.length === 0) return ''
  const headers = Array.from(new Set(arr.flatMap(o => (o && typeof o === 'object') ? Object.keys(o) : [])))
  const esc = (v: any) => {
    if (v === null || v === undefined) return ''
    const s = typeof v === 'object' ? JSON.stringify(v) : String(v)
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }
  const lines = [headers.join(',')]
  for (const item of arr) {
    lines.push(headers.map(h => esc(item ? item[h] : '')).join(','))
  }
  return lines.join('\n')
}

function parseCsv(text: string): any[] {
  const rows = csvRows(text)
  if (rows.length === 0) return []
  const headers = rows[0]
  return rows.slice(1).map(r => {
    const o: any = {}
    headers.forEach((h, idx) => { o[h] = csvVal(r[idx]) })
    return o
  })
}

function csvRows(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cur = ''
  let q = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (q) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cur += '"'; i++ } else q = false
      } else cur += ch
    } else {
      if (ch === '"') q = true
      else if (ch === ',') { row.push(cur); cur = '' }
      else if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = '' }
      else if (ch === '\r') { /* skip */ }
      else cur += ch
    }
  }
  if (cur !== '' || row.length > 0) { row.push(cur); rows.push(row) }
  return rows
}

function csvVal(s: string): any {
  if (s === '') return ''
  if (s === 'true') return true
  if (s === 'false') return false
  if (s === 'null') return null
  if (!isNaN(Number(s))) return Number(s)
  return s
}

function parseYaml(text: string): any {
  const lines = text.split('\n')
    .map(l => l.replace(/\t/g, '  '))
    .filter(l => l.trim() !== '' && !l.trimStart().startsWith('#'))
  let idx = 0
  const lead = (l: string) => l.length - l.trimStart().length
  function parseScalar(v: string): any {
    if (v === '[]') return []
    if (v === '{}') return {}
    if (v === 'null') return null
    if (v === 'true') return true
    if (v === 'false') return false
    if (/^".*"$/.test(v) || /^'.*'$/.test(v)) return v.slice(1, -1)
    if (!isNaN(Number(v))) return Number(v)
    return v
  }
  function parseBlock(indent: number): any {
    if (idx >= lines.length) return null
    const firstIndent = lead(lines[idx])
    if (lines[idx].trimStart().startsWith('- ')) {
      const arr: any[] = []
      while (idx < lines.length && lead(lines[idx]) === firstIndent && lines[idx].trimStart().startsWith('- ')) {
        const content = lines[idx].trimStart().slice(2)
        if (content === '') {
          idx++
          arr.push(parseBlock(firstIndent + 1))
        } else if (content.includes(': ')) {
          // '- key: val' 内联对象首行
          const sub: any = {}
          const ci = content.indexOf(':')
          const key = content.slice(0, ci).trim()
          const val = content.slice(ci + 1).trim()
          if (val === '') {
            idx++
            sub[key] = parseBlock(lead(lines[idx]))
          } else {
            sub[key] = parseScalar(val)
            idx++
          }
          // 继续读同一对象的后续缩进行
          while (idx < lines.length && lead(lines[idx]) > firstIndent && !lines[idx].trimStart().startsWith('- ')) {
            const kv = lines[idx].trimStart()
            const k2 = kv.slice(0, kv.indexOf(':')).trim()
            const v2 = kv.slice(kv.indexOf(':') + 1).trim()
            if (v2 === '') { idx++; sub[k2] = parseBlock(lead(lines[idx])) }
            else { sub[k2] = parseScalar(v2); idx++ }
          }
          arr.push(sub)
        } else {
          arr.push(parseScalar(content))
          idx++
        }
      }
      return arr
    }
    const obj: any = {}
    while (idx < lines.length && lead(lines[idx]) === firstIndent && !lines[idx].trimStart().startsWith('- ')) {
      const kv = lines[idx].trimStart()
      const ci = kv.indexOf(':')
      const key = kv.slice(0, ci).trim()
      const val = kv.slice(ci + 1).trim()
      if (val === '') {
        idx++
        obj[key] = parseBlock(lead(lines[idx]))
      } else if (val === '[]') { obj[key] = []; idx++ }
      else if (val === '{}') { obj[key] = {}; idx++ }
      else { obj[key] = parseScalar(val); idx++ }
    }
    return obj
  }
  return parseBlock(0)
}
</script>

<style scoped>
.json-tool-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.main-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
}

.action-bar {
  margin-bottom: 16px;
  padding: 12px;
  background: var(--bg-tertiary);
  border-radius: 6px;
}

.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}

.input-section,
.output-section {
  display: flex;
  flex-direction: column;
}

.input-section :deep(.n-input),
.output-section :deep(.n-input) {
  height: 600px;
}

.input-section :deep(.n-input-wrapper),
.output-section :deep(.n-input-wrapper) {
  height: 100%;
}

.input-section :deep(.n-input__textarea),
.output-section :deep(.n-input__textarea) {
  height: 100%;
  min-height: 600px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
}

.simple-container {
  margin-top: 16px;
}

.simple-container :deep(.n-input) {
  height: 300px;
}

.simple-container :deep(.n-input__textarea) {
  min-height: 300px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
}

.diff-container {
  margin-top: 16px;
}

.diff-container :deep(.n-input) {
  height: 200px;
}

.diff-container :deep(.n-input__textarea) {
  min-height: 200px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
}

@media (max-width: 1024px) {
  .editor-container {
    grid-template-columns: 1fr;
  }
}
</style>
