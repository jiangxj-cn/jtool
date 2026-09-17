<template>
  <div class="log-viewer">
    <n-button quaternary size="small" block @click="open = true">
      🐞 日志
      <span v-if="errorCount > 0" class="badge">{{ errorCount > 99 ? '99+' : errorCount }}</span>
    </n-button>

    <n-drawer v-model:show="open" :width="760" placement="right" @after-enter="refresh">
      <n-drawer-content title="JTool 运行日志" closable>
        <n-space vertical size="small">
          <n-space>
            <n-button size="tiny" @click="refresh">刷新</n-button>
            <n-button size="tiny" @click="onCopy">复制全部</n-button>
            <n-button size="tiny" @click="onDownload">导出文件</n-button>
            <n-button size="tiny" :type="confirmingClear ? 'error' : 'default'" ghost @click="onClear">
              {{ confirmingClear ? '确认清空？' : '清空' }}
            </n-button>
          </n-space>
          <n-text depth="3" style="font-size: 12px">
            共 {{ logs.length }} 条（错误 {{ errorCount }} 条）· 日志已持久化，重启后仍在 ·
            控制台可用 __jtoolExportLogs()
          </n-text>
          <n-space v-if="summary.length" vertical size="small" class="summary">
            <n-text depth="3" style="font-size: 12px">按来源+消息去重后的 Top 报错：</n-text>
            <n-text v-for="s in summary" :key="s.key" style="font-size: 12px" code>
              ×{{ s.count }} — {{ s.key }}
            </n-text>
          </n-space>
          <n-input
            type="textarea"
            :rows="24"
            readonly
            :value="text || '暂无日志'"
            style="font-family: Consolas, Monaco, monospace; font-size: 12px"
          />
        </n-space>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { NButton, NDrawer, NDrawerContent, NSpace, NText, NInput, useMessage } from 'naive-ui'
import {
  getLogs,
  clearLogs,
  copyLogs,
  downloadLogs,
  exportLogsText,
  countErrors,
  type LogEntry,
} from '../../utils/logger'

const message = useMessage()

const open = ref(false)
const logs = ref<LogEntry[]>([])
const errorCount = ref(0)
const confirmingClear = ref(false)
// 注意：不能写成 computed(() => exportLogsText()) —— 它没有任何响应式依赖，
// 只会求值一次并永久缓存，抽屉会一直显示打开时的旧快照。
const text = ref('')
const summary = ref<{ key: string; count: number }[]>([])
let timer: number | undefined
let clearTimer: number | undefined

/** 按「来源 + 消息」聚合，直接把刷屏的重复报错压成一行计数 */
const buildSummary = (list: LogEntry[]) => {
  const map = new Map<string, { key: string; count: number }>()
  for (const e of list) {
    if (e.level === 'info') continue
    const key = `${e.source} | ${e.message}`
    const n = e.repeat ?? 1
    const hit = map.get(key)
    if (hit) hit.count += n
    else map.set(key, { key, count: n })
  }
  return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 5)
}

const refresh = () => {
  logs.value = getLogs()
  errorCount.value = countErrors()
  text.value = exportLogsText()
  summary.value = buildSummary(logs.value)
}

const onCopy = async () => {
  const ok = await copyLogs()
  if (ok) message.success('日志已复制到剪贴板')
  else message.error('复制失败，请在文本框内手动全选复制')
}

const onDownload = () => {
  downloadLogs()
  message.info('已触发导出（若浏览器拦截下载，请改用「复制全部」）')
}

// 二次点击确认，避免依赖 window.confirm（WebView 环境不可靠）
const onClear = () => {
  if (!confirmingClear.value) {
    confirmingClear.value = true
    message.warning('再次点击「确认清空？」即可清空全部日志')
    clearTimer = window.setTimeout(() => { confirmingClear.value = false }, 3000)
    return
  }
  if (clearTimer) window.clearTimeout(clearTimer)
  confirmingClear.value = false
  clearLogs()
  refresh()
  message.success('日志已清空')
}

onMounted(() => {
  refresh()
  timer = window.setInterval(refresh, 2000)
})

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
  if (clearTimer) window.clearTimeout(clearTimer)
})
</script>

<style scoped>
.log-viewer {
  width: 100%;
}

.badge {
  display: inline-block;
  margin-left: 6px;
  padding: 0 6px;
  border-radius: 8px;
  background: #d03050;
  color: #fff;
  font-size: 11px;
  line-height: 16px;
}
</style>
