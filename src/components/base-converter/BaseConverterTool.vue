<template>
  <div class="tool-container">
    <h2>🔢 进制转换</h2>
    <p class="tool-description">支持 2-62 进制互相转换</p>
    
    <n-card class="tool-card">
      <n-space vertical>
        <n-input-group>
          <n-input-number v-model:value="inputValue" placeholder="输入数值" style="width: 200px" />
          <n-select v-model:value="fromBase" :options="baseOptions" style="width: 150px" />
        </n-input-group>
        
        <n-divider>转换结果</n-divider>
        
        <n-grid :cols="2" :x-gap="12">
          <n-gi>
            <n-input v-model:value="results.binary" readonly placeholder="二进制" />
            <div class="label">二进制 (Base 2)</div>
          </n-gi>
          <n-gi>
            <n-input v-model:value="results.octal" readonly placeholder="八进制" />
            <div class="label">八进制 (Base 8)</div>
          </n-gi>
          <n-gi>
            <n-input v-model:value="results.decimal" readonly placeholder="十进制" />
            <div class="label">十进制 (Base 10)</div>
          </n-gi>
          <n-gi>
            <n-input v-model:value="results.hexadecimal" readonly placeholder="十六进制" />
            <div class="label">十六进制 (Base 16)</div>
          </n-gi>
          <n-gi>
            <n-input v-model:value="results.base32" readonly placeholder="32 进制" />
            <div class="label">32 进制 (Base 32)</div>
          </n-gi>
          <n-gi>
            <n-input v-model:value="results.base62" readonly placeholder="62 进制" />
            <div class="label">62 进制 (Base 62)</div>
          </n-gi>
        </n-grid>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { NCard, NSpace, NInput, NInputGroup, NInputNumber, NSelect, NDivider, NGrid, NGi } from 'naive-ui'
import { convertAll } from '@jtool/core'

const inputValue = ref<number>(0)
const fromBase = ref<number>(10)

const baseOptions = [
  { label: '二进制 (Base 2)', value: 2 },
  { label: '八进制 (Base 8)', value: 8 },
  { label: '十进制 (Base 10)', value: 10 },
  { label: '十六进制 (Base 16)', value: 16 },
  { label: '32 进制 (Base 32)', value: 32 },
  { label: '62 进制 (Base 62)', value: 62 },
]

const results = ref({
  binary: '',
  octal: '',
  decimal: '',
  hexadecimal: '',
  base32: '',
  base62: '',
})

watch([inputValue, fromBase], () => {
  if (inputValue.value !== undefined) {
    try {
      const converted = convertAll(inputValue.value.toString(), fromBase.value)
      results.value = converted
    } catch (e) {
      // 忽略错误
    }
  }
}, { immediate: true })
</script>

<style scoped>
.tool-container { max-width: 900px; }
h2 { font-size: 24px; margin-bottom: 8px; }
.tool-description { color: var(--text-secondary); margin-bottom: 20px; }
.tool-card { background: var(--bg-secondary); border: 1px solid var(--border); }
.label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}
</style>
