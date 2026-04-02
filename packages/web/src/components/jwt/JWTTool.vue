<template>
  <div class="tool-container">
    <h2>🔑 JWT 解析与验证</h2>
    <p class="tool-description">解码 JSON Web Token，验证签名，检查过期时间</p>
    
    <n-card class="tool-card">
      <n-space vertical>
        <!-- Token 输入 -->
        <n-input
          v-model:value="token"
          type="textarea"
          placeholder="输入 JWT Token (格式：xxxxx.yyyyy.zzzzz)..."
          :rows="4"
          @input="decodeToken"
        />
        
        <!-- 签名验证 -->
        <n-divider style="margin: 12px 0">签名验证 (可选)</n-divider>
        <n-space vertical>
          <n-input
            v-model:value="secret"
            type="password"
            show-password-on="click"
            placeholder="密钥 (用于 HS256/HS384/HS512)"
          />
          <n-space>
            <n-select
              v-model:value="algorithm"
              :options="algorithmOptions"
              style="width: 150px"
            />
            <n-button @click="verifySignature" :disabled="!decoded">
              验证签名
            </n-button>
          </n-space>
          <n-alert v-if="signatureResult" :type="signatureResult.valid ? 'success' : 'error'">
            {{ signatureResult.message }}
          </n-alert>
        </n-space>
        
        <!-- 解码结果 -->
        <div v-if="decoded" class="result-section">
          <n-alert :type="decoded.valid ? 'success' : 'error'">
            {{ decoded.valid ? '✅ 解码成功' : '❌ ' + decoded.error }}
          </n-alert>
          
          <!-- Header -->
          <n-divider>Header</n-divider>
          <pre class="code-block">{{ JSON.stringify(decoded.header, null, 2) }}</pre>
          
          <!-- Payload -->
          <n-divider>Payload</n-divider>
          <pre class="code-block">{{ JSON.stringify(decoded.payload, null, 2) }}</pre>
          
          <!-- 标准字段高亮 -->
          <div v-if="hasStandardFields" class="standard-fields">
            <n-divider>📋 标准字段解析</n-divider>
            <n-space vertical>
              <div v-if="decoded.payload.iss" class="field-row">
                <n-tag type="info">iss (签发者)</n-tag>
                <span>{{ decoded.payload.iss }}</span>
              </div>
              <div v-if="decoded.payload.sub" class="field-row">
                <n-tag type="info">sub (主题)</n-tag>
                <span>{{ decoded.payload.sub }}</span>
              </div>
              <div v-if="decoded.payload.aud" class="field-row">
                <n-tag type="info">aud (受众)</n-tag>
                <span>{{ decoded.payload.aud }}</span>
              </div>
              <div v-if="decoded.payload.exp" class="field-row">
                <n-tag type="info">exp (过期时间)</n-tag>
                <span>{{ formatTimestamp(decoded.payload.exp) }}</span>
              </div>
              <div v-if="decoded.payload.nbf" class="field-row">
                <n-tag type="info">nbf (生效时间)</n-tag>
                <span>{{ formatTimestamp(decoded.payload.nbf) }}</span>
              </div>
              <div v-if="decoded.payload.iat" class="field-row">
                <n-tag type="info">iat (签发时间)</n-tag>
                <span>{{ formatTimestamp(decoded.payload.iat) }}</span>
              </div>
              <div v-if="decoded.payload.jti" class="field-row">
                <n-tag type="info">jti (JWT ID)</n-tag>
                <span>{{ decoded.payload.jti }}</span>
              </div>
            </n-space>
          </div>
          
          <!-- 过期状态 -->
          <div v-if="decoded.payload.exp" class="expiration-section">
            <n-divider>⏰ 过期状态</n-divider>
            <n-space vertical>
              <n-progress
                type="line"
                :percentage="expirationPercentage"
                :status="progressStatus"
                :show-indicator="true"
              />
              <n-space justify="space-between">
                <n-statistic label="过期时间">
                  {{ expirationTime }}
                </n-statistic>
                <n-statistic label="剩余时间">
                  {{ remainingTime }}
                </n-statistic>
                <n-statistic label="状态">
                  <n-tag :type="isExpired ? 'error' : 'success'" size="large">
                    {{ isExpired ? '❌ 已过期' : '✅ 有效' }}
                  </n-tag>
                </n-statistic>
              </n-space>
              <n-alert v-if="isExpiringSoon && !isExpired" type="warning">
                ⚠️ Token 即将过期 (少于 24 小时)
              </n-alert>
            </n-space>
          </div>
          
          <!-- Signature -->
          <n-divider>Signature</n-divider>
          <div class="signature">{{ decoded.signature }}</div>
        </div>
      </n-space>
    </n-card>
    
    <!-- JWT 生成器 (可选功能) -->
    <n-card class="tool-card" style="margin-top: 16px">
      <h3>🔧 生成 JWT (可选)</h3>
      <n-space vertical>
        <n-input
          v-model:value="payloadInput"
          type="textarea"
          placeholder='{"sub": "1234567890", "name": "John Doe", "iat": 1516239022}'
          :rows="3"
        />
        <n-input
          v-model:value="generateSecret"
          placeholder="密钥"
        />
        <n-space>
          <n-select
            v-model:value="generateAlgorithm"
            :options="algorithmOptions"
            style="width: 150px"
          />
          <n-button type="primary" @click="generateJWT">生成 Token</n-button>
        </n-space>
        <n-input
          v-model:value="generatedToken"
          readonly
          type="textarea"
          :rows="3"
          placeholder="生成的 JWT 将显示在这里..."
        />
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NCard, NSpace, NInput, NAlert, NDivider, NStatistic, NTag, NSelect, NButton, NProgress, NCode } from 'naive-ui'
import { decodeJWT, isJWTExpired, getJWTExpiration, verifyJWTSignature, createJWT } from '@jtool/core'
import CryptoJS from 'crypto-js'

const token = ref('')
const secret = ref('')
const algorithm = ref('HS256')
const decoded = ref<any>(null)
const signatureResult = ref<any>(null)
const payloadInput = ref('')
const generateSecret = ref('')
const generateAlgorithm = ref('HS256')
const generatedToken = ref('')

const algorithmOptions = [
  { label: 'HS256', value: 'HS256' },
  { label: 'HS384', value: 'HS384' },
  { label: 'HS512', value: 'HS512' },
]

const decodeToken = () => {
  if (!token.value.trim()) {
    decoded.value = null
    signatureResult.value = null
    return
  }
  decoded.value = decodeJWT(token.value)
  signatureResult.value = null
}

const verifySignature = () => {
  if (!decoded.value || !secret.value) return
  
  const result = verifyJWTSignature(token.value, secret.value, algorithm.value as any)
  signatureResult.value = {
    valid: result.valid,
    message: result.valid ? '✅ 签名验证通过' : '❌ 签名验证失败：' + result.error,
  }
}

const expirationTime = computed(() => {
  if (!decoded.value?.payload.exp) return '-'
  const exp = getJWTExpiration(token.value)
  return exp ? exp.toLocaleString('zh-CN') : '-'
})

const remainingTime = computed(() => {
  if (!decoded.value?.payload.exp) return '-'
  const exp = decoded.value.payload.exp * 1000
  const now = Date.now()
  const diff = exp - now
  
  if (diff <= 0) return '已过期'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}天 ${hours % 24}小时`
  }
  return `${hours}小时 ${minutes}分 ${seconds}秒`
})

const isExpired = computed(() => {
  if (!decoded.value?.payload.exp) return false
  return isJWTExpired(token.value)
})

const isExpiringSoon = computed(() => {
  if (!decoded.value?.payload.exp || isExpired.value) return false
  const exp = decoded.value.payload.exp * 1000
  const now = Date.now()
  const diff = exp - now
  return diff < 24 * 60 * 60 * 1000 // 少于 24 小时
})

const expirationPercentage = computed(() => {
  if (!decoded.value?.payload.exp) return 0
  const exp = decoded.value.payload.exp * 1000
  const iat = decoded.value.payload.iat * 1000 || Date.now()
  const now = Date.now()
  
  if (now >= exp) return 100
  if (now <= iat) return 0
  
  const total = exp - iat
  const elapsed = now - iat
  return Math.min(100, Math.round((elapsed / total) * 100))
})

const progressStatus = computed(() => {
  if (isExpired.value) return 'error'
  if (isExpiringSoon.value) return 'warning'
  return 'success'
})

const hasStandardFields = computed(() => {
  if (!decoded.value?.payload) return false
  const fields = ['iss', 'sub', 'aud', 'exp', 'nbf', 'iat', 'jti']
  return fields.some(field => decoded.value.payload[field])
})

const formatTimestamp = (ts: number) => {
  if (!ts) return '-'
  const date = new Date(ts * 1000)
  return date.toLocaleString('zh-CN') + ` (${ts})`
}

const generateJWT = () => {
  try {
    let payload
    try {
      payload = JSON.parse(payloadInput.value)
    } catch (e) {
      generatedToken.value = '错误：无效的 JSON 格式'
      return
    }
    
    const token = createJWT(payload, generateSecret.value, generateAlgorithm.value as any)
    generatedToken.value = token
  } catch (e: any) {
    generatedToken.value = '错误：' + e.message
  }
}
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
  line-height: 1.5;
}
.signature {
  word-break: break-all;
  font-family: 'Consolas', monospace;
  font-size: 12px;
  color: var(--text-secondary);
}
.standard-fields { margin-top: 12px; }
.field-row { display: flex; align-items: center; gap: 12px; margin: 6px 0; }
.expiration-section { margin-top: 12px; }
h3 { font-size: 18px; margin-bottom: 12px; }
</style>
