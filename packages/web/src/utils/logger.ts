/**
 * JTool 本地日志系统
 * ------------------------------------------------------------------
 * 目标：发生任意错误都能留下痕迹，便于定位问题。
 * 捕获来源：
 *   - window 'error'            （未捕获异常、资源加载失败）
 *   - window 'unhandledrejection'（未处理的 Promise 拒绝）
 *   - Vue app.config.errorHandler（组件渲染/生命周期/事件里的异常）
 *   - Vue app.config.warnHandler （开发期告警）
 *   - vue-router onError / afterEach（导航失败、懒加载 chunk 加载失败）
 *   - console.error / console.warn（第三方库只打日志不抛异常的情况）
 * 持久化：localStorage 环形缓冲（默认最多 500 条 / ~512KB），刷新、重启后仍在。
 * 出口：控制台 __jtoolLogs() / __jtoolExportLogs()，以及界面上的「日志」面板。
 */

import type { App } from 'vue'
import type { Router } from 'vue-router'

export type LogLevel = 'error' | 'warn' | 'info'

export interface LogEntry {
  /** 时间戳 ms */
  t: number
  level: LogLevel
  /** 来源标记，如 window.error / vue / router / console / manual */
  source: string
  message: string
  stack?: string
  /** 附加上下文（组件信息、路由、位置等） */
  detail?: string
}

const STORAGE_KEY = 'jtool:logs'
const MAX_ENTRIES = 500
const MAX_BYTES = 512 * 1024

let entries: LogEntry[] = []
let loaded = false
let installed = false
let inConsoleHook = false

/* ------------------------------ 基础工具 ------------------------------ */

function safeStringify(v: unknown): string {
  try {
    if (typeof v === 'string') return v
    if (v instanceof Error) return `${v.name}: ${v.message}`
    if (typeof v === 'object' && v !== null) return JSON.stringify(v)
    return String(v)
  } catch {
    return Object.prototype.toString.call(v)
  }
}

function normalizeError(err: unknown): { message: string; stack?: string } {
  if (err == null) return { message: '' }
  if (err instanceof Error) return { message: err.message || err.name, stack: err.stack }
  if (typeof err === 'string') return { message: err }
  return { message: safeStringify(err) }
}

/* ------------------------------ 持久化 ------------------------------ */

function load(): void {
  if (loaded) return
  loaded = true
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const arr = JSON.parse(raw)
    if (Array.isArray(arr)) {
      entries = arr.filter((e) => e && typeof e.t === 'number').slice(-MAX_ENTRIES)
    }
  } catch {
    /* 损坏则忽略 */
  }
}

function persist(): void {
  try {
    let list = entries
    if (list.length > MAX_ENTRIES) list = list.slice(-MAX_ENTRIES)
    let json = JSON.stringify(list)
    // 体积兜底：超限就砍掉最旧的四分之一，直到达标
    while (json.length > MAX_BYTES && list.length > 1) {
      list = list.slice(Math.ceil(list.length / 4))
      json = JSON.stringify(list)
    }
    entries = list
    localStorage.setItem(STORAGE_KEY, json)
  } catch {
    // 配额不足 / 隐私模式：进一步缩容再试
    try {
      entries = entries.slice(-100)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {
      /* 放弃持久化，内存里仍保留 */
    }
  }
}

/* ------------------------------ 写入 API ------------------------------ */

export function addLog(
  level: LogLevel,
  source: string,
  message: string,
  stack?: string,
  detail?: string
): void {
  load()
  const entry: LogEntry = { t: Date.now(), level, source, message: message ?? '', stack, detail }
  entries.push(entry)
  persist()
  mirrorToConsole(entry)
}

/** 立即写一次（同步落盘），保证崩溃前已保存 */
function mirrorToConsole(e: LogEntry): void {
  try {
    const tag = `[JTool/${e.level}] ${e.source}`
    const extra = e.detail ? ` | ${e.detail}` : ''
    if (e.level === 'error') console.error(`${tag} ${e.message}${extra}`)
    else if (e.level === 'warn') console.warn(`${tag} ${e.message}${extra}`)
    else console.log(`${tag} ${e.message}${extra}`)
  } catch {
    /* ignore */
  }
}

export function logError(source: string, message: string, err?: unknown, detail?: string): void {
  const n = normalizeError(err)
  addLog('error', source, message || n.message || '未知错误', n.stack, detail)
}

export function logWarn(source: string, message: string, detail?: string): void {
  addLog('warn', source, message, undefined, detail)
}

export function logInfo(source: string, message: string, detail?: string): void {
  addLog('info', source, message, undefined, detail)
}

/* ------------------------------ 读取 / 导出 ------------------------------ */

export function getLogs(): LogEntry[] {
  load()
  return entries.slice()
}

export function clearLogs(): void {
  entries = []
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
  logInfo('logger', '日志已清空')
}

export function countErrors(): number {
  load()
  let n = 0
  for (const e of entries) if (e.level === 'error') n++
  return n
}

function formatEntry(e: LogEntry): string {
  const ts = new Date(e.t).toISOString()
  let s = `[${ts}] [${e.level.toUpperCase()}] [${e.source}] ${e.message}`
  if (e.detail) s += `\n    ↳ ${e.detail}`
  if (e.stack) {
    const lines = e.stack.split('\n').slice(0, 12)
    s += '\n' + lines.map((l) => '    ' + l.trim()).join('\n')
  }
  return s
}

export function exportLogsText(): string {
  load()
  const header = [
    `# JTool 运行日志`,
    `# 导出时间: ${new Date().toISOString()}`,
    `# 页面: ${typeof location !== 'undefined' ? location.href : ''}`,
    `# UA: ${typeof navigator !== 'undefined' ? navigator.userAgent : ''}`,
    `# 共 ${entries.length} 条`,
    '',
  ].join('\n')
  return header + entries.map(formatEntry).join('\n\n')
}

/** 复制全部日志到剪贴板（Tauri WebView 里也可靠） */
export async function copyLogs(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(exportLogsText())
    return true
  } catch {
    return false
  }
}

/** 导出为 .log 文件（浏览器 / WebView 支持下载时可用） */
export function downloadLogs(): void {
  try {
    const blob = new Blob([exportLogsText()], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `jtool-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.log`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 2000)
  } catch (e) {
    logError('logger', '导出日志文件失败', e)
  }
}

/* ------------------------------ 全局装配 ------------------------------ */

function installConsoleHook(): void {
  const origError = console.error.bind(console)
  const origWarn = console.warn.bind(console)

  console.error = (...args: unknown[]) => {
    if (!inConsoleHook) {
      inConsoleHook = true
      try {
        const msg = args.map(safeStringify).join(' ')
        // 跳过本系统自身的回显，避免重复记录
        if (!msg.includes('[JTool/')) addLog('error', 'console.error', msg)
      } finally {
        inConsoleHook = false
      }
    }
    origError(...args)
  }

  console.warn = (...args: unknown[]) => {
    if (!inConsoleHook) {
      inConsoleHook = true
      try {
        const msg = args.map(safeStringify).join(' ')
        if (!msg.includes('[JTool/')) addLog('warn', 'console.warn', msg)
      } finally {
        inConsoleHook = false
      }
    }
    origWarn(...args)
  }
}

/**
 * 装配全局错误捕获。应在 app.mount() 之前调用。
 */
export function installGlobalErrorHandlers(app?: App, router?: Router): void {
  if (installed) return
  installed = true
  load()

  // 1) 未捕获异常 / 资源加载失败
  window.addEventListener('error', (ev: ErrorEvent) => {
    if (ev.error) {
      logError(
        'window.error',
        ev.message || '未捕获异常',
        ev.error,
        `${ev.filename || '?'}:${ev.lineno}:${ev.colno}`
      )
    } else {
      const t = ev.target as HTMLElement | null
      const url = (t as HTMLImageElement)?.src || (t as HTMLAnchorElement)?.href || ev.message
      logError('window.error', `资源加载失败: ${url || '未知资源'}`, undefined, `tag=${t?.tagName}`)
    }
  })

  // 2) 未处理的 Promise 拒绝
  window.addEventListener('unhandledrejection', (ev: PromiseRejectionEvent) => {
    logError('unhandledrejection', '未处理的 Promise 拒绝', ev.reason)
  })

  // 3) Vue 组件层
  if (app) {
    app.config.errorHandler = (err, _instance, info) => {
      logError('vue.errorHandler', 'Vue 组件错误', err, `hook=${info}`)
    }
    app.config.warnHandler = (msg, _instance, trace) => {
      addLog('warn', 'vue.warn', msg, undefined, trace ? String(trace).slice(0, 400) : undefined)
    }
  }

  // 4) 路由：导航失败 / 懒加载 chunk 加载失败
  if (router) {
    router.onError((err, to, from) => {
      logError(
        'router.onError',
        `路由跳转失败: ${from?.fullPath ?? '?'} → ${to?.fullPath ?? '?'}`,
        err
      )
    })
    router.afterEach((to, from, failure) => {
      if (failure) {
        logWarn('router', `导航未完成: ${from.fullPath} → ${to.fullPath}`, failure.message)
      }
    })
  }

  installConsoleHook()

  // 5) 控制台逃生通道
  const w = window as unknown as Record<string, unknown>
  w.__jtoolLogs = getLogs
  w.__jtoolExportLogs = exportLogsText
  w.__jtoolClearLogs = clearLogs

  logInfo('logger', '日志系统已就绪', `href=${location.href}`)
}
