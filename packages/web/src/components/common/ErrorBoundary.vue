<template>
  <div v-if="err" class="error-boundary">
    <n-alert type="error" title="此页面出错了（已写入日志）">
      <pre class="err-text">{{ err }}</pre>
      <n-space style="margin-top: 12px">
        <n-button size="small" type="primary" @click="retry">重试</n-button>
        <n-button size="small" @click="goHome">返回首页</n-button>
      </n-space>
    </n-alert>
  </div>
  <div v-else :key="nonce" class="eb-slot">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { NAlert, NButton, NSpace } from 'naive-ui'
import { logError } from '../../utils/logger'

const err = ref('')
const nonce = ref(0)
const router = useRouter()

onErrorCaptured((e, _instance, info) => {
  // 兜住子组件渲染/生命周期里的异常，避免整棵树被拖死
  logError('ErrorBoundary', '组件异常已被错误边界捕获', e, `hook=${info}`)
  err.value = e instanceof Error ? `${e.name}: ${e.message}\n${e.stack ?? ''}` : String(e)
  return false // 阻断继续向上冒泡
})

const retry = () => {
  err.value = ''
  nonce.value++ // 换 key 强制子组件重新挂载
}

const goHome = () => {
  err.value = ''
  nonce.value++
  router.push('/').catch(() => {})
}
</script>

<style scoped>
.error-boundary {
  max-width: 900px;
  margin: 24px auto;
}

.err-text {
  margin: 8px 0 0;
  max-height: 320px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: Consolas, Monaco, monospace;
  font-size: 12px;
}
</style>
