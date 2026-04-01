<template>
  <div class="tool-container">
    <h2>🔑 JWT 解码</h2>
    <p class="tool-description">解码 JSON Web Token，查看 Header 和 Payload</p>
    
    <n-card class="tool-card">
      <n-space vertical>
        <n-input
          v-model:value="token"
          type="textarea"
          placeholder="输入 JWT Token..."
          :rows="4"
          @input="decodeToken"
        />
        
        <div v-if="decoded" class="result-section">
          <n-alert :type="decoded.valid ? 'success' : 'error'">
            {{ decoded.valid ? '✅ 解码成功' : '❌ ' + decoded.error }}
          </n-alert>
          
          <n-divider>Header</n-divider>
          <pre class="code-block">{{ JSON.stringify(decoded.header, null, 2) }}</pre>
          
          <n-divider>Payload</n-divider>
          <pre class="code-block">{{ JSON.stringify(decoded.payload, null, 2) }}</pre>
          
          <n-divider>Signature</n-divider>
          <div class="signature">{{ decoded.signature }}</div>
          
          <n-space v-if="decoded.payload.exp">
            <n-statistic label="过期时间">
              {{ expirationTime }}
            </n-statistic>
            <n-statistic label="状态">
              <n-tag :type="isExpired ? 'error' : 'success'">
                {{ isExpired ? '已过期' : '未过期' }}
              </n-tag>
            </n-statistic>
          </n-space>
        </div>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NCard, NSpace, NInput, NAlert, NDivider, NStatistic, NTag } from 'naive-ui'
import { decodeJWT, isJWTExpired, getJWTExpiration } from '@jtool/core'

const token = ref('')
const decoded = ref<any>(null)

const decodeToken = () => {
  if (!token.value.trim()) {
    decoded.value = null
    return
  }
  decoded.value = decodeJWT(token.value)
}

const expirationTime = computed(() => {
  if (!decoded.value?.payload.exp) return '-'
  const exp = getJWTExpiration(token.value)
  return exp ? exp.toLocaleString('zh-CN') : '-'
})

const isExpired = computed(() => {
  if (!decoded.value?.payload.exp) return false
  return isJWTExpired(token.value)
})
</script>

<style scoped>
.tool-container { max-width: 100%; margin: 0 auto; }
@media (min-width: 1200px) { .tool-container { max-width: 1200px; } }
@media (min-width: 1600px) { .tool-container { max-width: 1600px; } }
h2 { font-size: 24px; margin-bottom: 8px; }
.tool-description { color: var(--text-secondary); margin-bottom: 20px; }
.tool-card { background: var(--bg-secondary); border: 1px solid var(--border); }
.result-section { margin-top: 12px; }
.code-block {
  background: var(--bg-primary);
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Consolas', monospace;
  font-size: 13px;
}
.signature {
  word-break: break-all;
  font-family: 'Consolas', monospace;
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
