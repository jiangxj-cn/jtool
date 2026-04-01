<template>
  <div class="tool-container">
    <h2>📝 JSON 工具</h2>
    <p class="tool-description">格式化、校验、压缩 JSON 数据</p>
    
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
        <n-input
          v-model:value="outputJson"
          type="textarea"
          placeholder="结果..."
          :rows="6"
          readonly
        />
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JSON5 from 'json5'
import { NCard, NInput, NButton, NSpace } from 'naive-ui'

const inputJson = ref('')
const outputJson = ref('')

const format = () => {
  try {
    const obj = JSON5.parse(inputJson.value)
    outputJson.value = JSON.stringify(obj, null, 2)
  } catch (e) {
    outputJson.value = `❌ 无效 JSON: ${(e as Error).message}`
  }
}

const validate = () => {
  try {
    JSON5.parse(inputJson.value)
    outputJson.value = '✅ JSON 格式正确'
  } catch (e) {
    outputJson.value = `❌ 无效 JSON: ${(e as Error).message}`
  }
}

const compress = () => {
  try {
    const obj = JSON5.parse(inputJson.value)
    outputJson.value = JSON.stringify(obj)
  } catch (e) {
    outputJson.value = `❌ 无效 JSON: ${(e as Error).message}`
  }
}
</script>

<style scoped>
.tool-container { max-width: 900px; }
h2 { font-size: 24px; margin-bottom: 8px; }
.tool-description { color: var(--text-secondary); margin-bottom: 20px; }
.tool-card { background: var(--bg-secondary); border: 1px solid var(--border); }
</style>
