<template>
  <div class="tool-container">
    <h2>📝 JSON 工具</h2>
    <p class="tool-description">格式化、校验、压缩、转义、去除转义符等</p>
    
    <n-card class="tool-card">
      <n-space vertical>
        <n-input
          v-model:value="inputJson"
          type="textarea"
          placeholder="输入 JSON..."
          :rows="6"
        />
        <n-space>
          <n-button type="primary" @click="format">格式化</n-button>
          <n-button @click="validate">校验</n-button>
          <n-button @click="compress">压缩</n-button>
        </n-space>
        <n-space>
          <n-button @click="escapeStr">字符串转义</n-button>
          <n-button @click="unescapeStr">去除转义</n-button>
          <n-button @click="escapeAll">全部转义</n-button>
          <n-button @click="unescapeAll">全部去转义</n-button>
        </n-space>
        <n-input
          v-model:value="outputJson"
          type="textarea"
          placeholder="结果..."
          :rows="6"
          readonly
        />
        <n-space v-if="errorMsg">
          <n-alert type="error">{{ errorMsg }}</n-alert>
        </n-space>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JSON5 from 'json5'
import { NCard, NInput, NButton, NSpace, NAlert } from 'naive-ui'
import { jsonEscape, jsonUnescape, jsonEscapeAll, jsonUnescapeAll } from '@jtool/core'

const inputJson = ref('')
const outputJson = ref('')
const errorMsg = ref('')

const clearError = () => {
  errorMsg.value = ''
}

const format = () => {
  clearError()
  try {
    const obj = JSON5.parse(inputJson.value)
    outputJson.value = JSON.stringify(obj, null, 2)
  } catch (e) {
    errorMsg.value = `❌ 无效 JSON: ${(e as Error).message}`
  }
}

const validate = () => {
  clearError()
  try {
    JSON5.parse(inputJson.value)
    outputJson.value = '✅ JSON 格式正确'
  } catch (e) {
    errorMsg.value = `❌ 无效 JSON: ${(e as Error).message}`
  }
}

const compress = () => {
  clearError()
  try {
    const obj = JSON5.parse(inputJson.value)
    outputJson.value = JSON.stringify(obj)
  } catch (e) {
    errorMsg.value = `❌ 无效 JSON: ${(e as Error).message}`
  }
}

const escapeStr = () => {
  clearError()
  try {
    outputJson.value = jsonEscape(inputJson.value)
  } catch (e) {
    errorMsg.value = `转义失败：${(e as Error).message}`
  }
}

const unescapeStr = () => {
  clearError()
  try {
    outputJson.value = jsonUnescape(inputJson.value)
  } catch (e) {
    errorMsg.value = `去转义失败：${(e as Error).message}`
  }
}

const escapeAll = () => {
  clearError()
  outputJson.value = jsonEscapeAll(inputJson.value)
}

const unescapeAll = () => {
  clearError()
  outputJson.value = jsonUnescapeAll(inputJson.value)
}
</script>

<style scoped>
.tool-container { max-width: 100%; margin: 0 auto; }
@media (min-width: 1200px) { .tool-container { max-width: 1200px; } }
@media (min-width: 1600px) { .tool-container { max-width: 1600px; } }
h2 { font-size: 24px; margin-bottom: 8px; }
.tool-description { color: var(--text-secondary); margin-bottom: 20px; }
.tool-card { background: var(--bg-secondary); border: 1px solid var(--border); }
</style>
