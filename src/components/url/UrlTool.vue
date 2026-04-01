<template>
  <div class="tool-container">
    <h2>🔗 URL 编码</h2>
    <p class="tool-description">URL 编码和解码工具</p>
    
    <n-card class="tool-card">
      <n-space vertical>
        <n-input
          v-model:value="inputText"
          type="textarea"
          placeholder="输入 URL 或文本..."
          :rows="4"
        />
        <n-space>
          <n-button type="primary" @click="encode">编码 →</n-button>
          <n-button @click="decode">← 解码</n-button>
        </n-space>
        <n-input
          v-model:value="outputText"
          type="textarea"
          placeholder="结果..."
          :rows="4"
          readonly
        />
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NInput, NButton, NSpace } from 'naive-ui'

const inputText = ref('')
const outputText = ref('')

const encode = () => {
  outputText.value = encodeURIComponent(inputText.value)
}

const decode = () => {
  try {
    outputText.value = decodeURIComponent(inputText.value)
  } catch (e) {
    outputText.value = '❌ 解码失败：无效的 URL 编码'
  }
}
</script>

<style scoped>
.tool-container { max-width: 900px; }
h2 { font-size: 24px; margin-bottom: 8px; }
.tool-description { color: var(--text-secondary); margin-bottom: 20px; }
.tool-card { background: var(--bg-secondary); border: 1px solid var(--border); }
</style>
