<template>
  <div class="tool-container">
    <h2>🔤 ASCII 编码转换</h2>
    <p class="tool-description">字符串与 ASCII 码互转，支持十进制/十六进制/八进制/二进制格式</p>
    
    <n-card class="tool-card">
      <n-space vertical>
        <!-- 格式选择 -->
        <div class="format-selector">
          <span class="format-label">格式：</span>
          <n-radio-group v-model:value="asciiFormat">
            <n-radio-button value="decimal">十进制</n-radio-button>
            <n-radio-button value="hex">十六进制</n-radio-button>
            <n-radio-button value="octal">八进制</n-radio-button>
            <n-radio-button value="binary">二进制</n-radio-button>
          </n-radio-group>
        </div>
        
        <!-- 输入区域 -->
        <n-input
          v-model:value="inputText"
          type="textarea"
          placeholder="输入文本或 ASCII 码..."
          :rows="4"
        />
        
        <!-- 操作按钮 -->
        <n-space>
          <n-button type="primary" @click="stringToAscii">
            <template #icon>→</template>
            转 ASCII
          </n-button>
          <n-button @click="asciiToString">
            <template #icon>←</template>
            转字符串
          </n-button>
          <n-button @click="swapContent">
            <template #icon>⇄</template>
            交换
          </n-button>
          <n-button @click="clearAll">清空</n-button>
        </n-space>
        
        <!-- 输出区域 -->
        <n-input
          v-model:value="outputText"
          type="textarea"
          placeholder="结果..."
          :rows="4"
          readonly
        />
        
        <!-- 示例 -->
        <n-alert type="info" :bordered="false">
          <template #header>💡 示例</template>
          <div class="example-content">
            <p><strong>字符串 → ASCII（十进制）：</strong> "Hello" → 72 101 108 108 111</p>
            <p><strong>字符串 → ASCII（十六进制）：</strong> "Hi" → 48 69</p>
            <p><strong>ASCII → 字符串：</strong> "65 66 67" → "ABC"</p>
          </div>
        </n-alert>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NInput, NButton, NSpace, NRadioGroup, NRadioButton, NAlert } from 'naive-ui'
import { stringToAscii, asciiToString, type AsciiFormat } from '../../packages/core/src/ascii'

const inputText = ref('')
const outputText = ref('')
const asciiFormat = ref<AsciiFormat>('decimal')

const stringToAscii = () => {
  if (!inputText.value.trim()) {
    outputText.value = '请输入要转换的字符串'
    return
  }
  
  const result = stringToAscii(inputText.value, asciiFormat.value)
  outputText.value = result.success ? result.result : `错误：${result.error}`
}

const asciiToString = () => {
  if (!inputText.value.trim()) {
    outputText.value = '请输入 ASCII 码'
    return
  }
  
  const result = asciiToString(inputText.value, asciiFormat.value)
  outputText.value = result.success ? result.result : `错误：${result.error}`
}

const swapContent = () => {
  const temp = inputText.value
  inputText.value = outputText.value
  outputText.value = temp
}

const clearAll = () => {
  inputText.value = ''
  outputText.value = ''
}
</script>

<style scoped>
.tool-container { max-width: 100%; margin: 0 auto; }
@media (min-width: 1200px) { .tool-container { max-width: 1200px; } }
@media (min-width: 1600px) { .tool-container { max-width: 1600px; } }
h2 { font-size: 24px; margin-bottom: 8px; }
.tool-description { color: var(--text-secondary); margin-bottom: 20px; }
.tool-card { background: var(--bg-secondary); border: 1px solid var(--border); }

.format-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.format-label {
  font-weight: 500;
  color: var(--text-primary);
}

.example-content {
  font-size: 13px;
  line-height: 1.8;
}

.example-content p {
  margin: 4px 0;
}
</style>
