<template>
  <div class="tool-container">
    <h2>📐 哈希计算</h2>
    <p class="tool-description">支持 MD5, SHA1, SHA256, SHA512 等多种哈希算法</p>
    
    <n-card class="tool-card">
      <n-input
        v-model:value="inputText"
        type="textarea"
        placeholder="输入要计算哈希的文本..."
        :rows="4"
        @input="calculateHash"
      />
      
      <div class="results">
        <div class="result-item" v-for="algo in algorithms" :key="algo">
          <span class="algo-name">{{ algo }}</span>
          <n-input :value="hashResults[algo]" readonly />
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import CryptoJS from 'crypto-js'
import { NCard, NInput } from 'naive-ui'

const inputText = ref('')

const algorithms = ['MD5', 'SHA1', 'SHA256', 'SHA512']

const hashResults = reactive<Record<string, string>>({
  MD5: '',
  SHA1: '',
  SHA256: '',
  SHA512: '',
})

const calculateHash = () => {
  if (!inputText.value) {
    algorithms.forEach(algo => hashResults[algo] = '')
    return
  }
  
  hashResults.MD5 = CryptoJS.MD5(inputText.value).toString()
  hashResults.SHA1 = CryptoJS.SHA1(inputText.value).toString()
  hashResults.SHA256 = CryptoJS.SHA256(inputText.value).toString()
  hashResults.SHA512 = CryptoJS.SHA512(inputText.value).toString()
}
</script>

<style scoped>
.tool-container {
  max-width: 900px;
}

h2 {
  font-size: 24px;
  margin-bottom: 8px;
}

.tool-description {
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.tool-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
}

.results {
  margin-top: 20px;
}

.result-item {
  margin-bottom: 12px;
}

.algo-name {
  display: block;
  font-weight: bold;
  margin-bottom: 4px;
  color: var(--accent);
}
</style>
