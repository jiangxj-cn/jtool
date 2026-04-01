<template>
  <div class="ascii-tool">
    <div class="tool-header">
      <h2>🔢 ASCII 编码转换</h2>
      <p class="tool-description">字符串与 ASCII 码之间的互相转换，支持十进制、十六进制、八进制、二进制格式</p>
    </div>

    <div class="tool-content">
      <!-- 转换方向选择 -->
      <div class="conversion-mode">
        <n-radio-group v-model:value="conversionMode" size="large">
          <n-radio-button value="string-to-ascii">字符串 → ASCII</n-radio-button>
          <n-radio-button value="ascii-to-string">ASCII → 字符串</n-radio-button>
        </n-radio-group>
      </div>

      <!-- 格式选择 -->
      <div class="format-selector">
        <n-space>
          <n-tag
            v-for="format in formatOptions"
            :key="format.value"
            :type="outputFormat === format.value ? 'primary' : 'default'"
            :bordered="false"
            size="large"
            checkable
            :checked="outputFormat === format.value"
            @click="outputFormat = format.value"
          >
            {{ format.label }}
          </n-tag>
        </n-space>
      </div>

      <!-- 输入区域 -->
      <div class="input-section">
        <div class="input-header">
          <n-space>
            <n-text strong>{{ conversionMode === 'string-to-ascii' ? '输入字符串' : '输入 ASCII 码' }}</n-text>
            <n-tag v-if="outputFormat !== 'decimal'" type="info" size="small" :bordered="false">
              {{ getFormatLabel(outputFormat) }}
            </n-tag>
          </n-space>
          <n-space>
            <n-button size="small" @click="clearInput">清空</n-button>
            <n-button size="small" @click="pasteFromClipboard">粘贴</n-button>
          </n-space>
        </div>
        <n-input
          v-model:value="inputValue"
          type="textarea"
          :placeholder="conversionMode === 'string-to-ascii' 
            ? '请输入要转换的字符串...\n例如：Hello World' 
            : '请输入 ASCII 码，用空格分隔...\n例如：72 101 108 108 111'"
          :rows="6"
          @input="handleInput"
        />
      </div>

      <!-- 批量转换 -->
      <div class="batch-section">
        <n-checkbox v-model:checked="enableBatch">批量转换（每行一条）</n-checkbox>
      </div>

      <!-- 输出区域 -->
      <div class="output-section">
        <div class="output-header">
          <n-space>
            <n-text strong>{{ conversionMode === 'string-to-ascii' ? 'ASCII 结果' : '字符串结果' }}</n-text>
            <n-tag v-if="conversionMode === 'ascii-to-string' && outputFormat !== 'decimal'" type="success" size="small" :bordered="false">
              从 {{ getFormatLabel(outputFormat) }} 转换
            </n-tag>
          </n-space>
          <n-space>
            <n-button size="small" @click="copyResult" :disabled="!resultValue">复制</n-button>
            <n-button size="small" @click="downloadResult" :disabled="!resultValue">下载</n-button>
          </n-space>
        </div>
        <n-input
          v-model:value="resultValue"
          type="textarea"
          placeholder="转换结果将显示在这里..."
          :rows="6"
          readonly
        />
      </div>

      <!-- 实时预览 -->
      <div v-if="enablePreview && resultValue" class="preview-section">
        <div class="preview-header">
          <n-text strong>📊 统计信息</n-text>
        </div>
        <n-grid :cols="4" :x-gap="12">
          <n-statistic label="字符数">
            <template #prefix>📝</template>
            {{ charCount }}
          </n-statistic>
          <n-statistic label="ASCII 码数量">
            <template #prefix>🔢</template>
            {{ asciiCount }}
          </n-statistic>
          <n-statistic label="字节数">
            <template #prefix>💾</template>
            {{ byteCount }}
          </n-statistic>
          <n-statistic label="格式">
            <template #prefix>📋</template>
            {{ getFormatLabel(outputFormat) }}
          </n-statistic>
        </n-grid>
      </div>

      <!-- 快速示例 -->
      <div class="examples-section">
        <n-text depth="3" style="font-size: 12px">💡 快速示例：</n-text>
        <n-space style="margin-top: 8px">
          <n-button size="small" secondary @click="loadExample('hello')">Hello World</n-button>
          <n-button size="small" secondary @click="loadExample('chinese')">中文测试</n-button>
          <n-button size="small" secondary @click="loadExample('mixed')">混合 123</n-button>
          <n-button 
            v-if="conversionMode === 'ascii-to-string'" 
            size="small" 
            secondary 
            @click="loadExample('ascii-decimal')">十进制示例</n-button>
          <n-button 
            v-if="conversionMode === 'ascii-to-string'" 
            size="small" 
            secondary 
            @click="loadExample('ascii-hex')">十六进制示例</n-button>
        </n-space>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { 
  NRadioGroup, NRadioButton, NTag, NSpace, NText, NInput, 
  NButton, NCheckbox, NGrid, NStatistic, useMessage 
} from 'naive-ui'
import { 
  stringToAscii, asciiToString, 
  stringToAsciiDecimal, stringToAsciiHex, 
  stringToAsciiOctal, stringToAsciiBinary,
  asciiDecimalToString, asciiHexToString,
  asciiOctalToString, asciiBinaryToString,
  type AsciiFormat 
} from '@jtool/core'

const message = useMessage()

// 状态
const conversionMode = ref<'string-to-ascii' | 'ascii-to-string'>('string-to-ascii')
const outputFormat = ref<AsciiFormat>('decimal')
const inputValue = ref('')
const resultValue = ref('')
const enableBatch = ref(false)
const enablePreview = ref(true)

// 格式选项
const formatOptions = [
  { label: '十进制', value: 'decimal' as AsciiFormat },
  { label: '十六进制', value: 'hex' as AsciiFormat },
  { label: '八进制', value: 'octal' as AsciiFormat },
  { label: '二进制', value: 'binary' as AsciiFormat },
]

// 获取格式标签
const getFormatLabel = (format: AsciiFormat) => {
  const option = formatOptions.find(f => f.value === format)
  return option?.label || format
}

// 统计信息
const charCount = computed(() => inputValue.value.length)
const asciiCount = computed(() => {
  if (!resultValue.value) return 0
  return resultValue.value.trim().split(/\s+/).filter(s => s.length > 0).length
})
const byteCount = computed(() => new Blob([resultValue.value]).size)

// 处理输入
const handleInput = () => {
  if (!inputValue.value.trim()) {
    resultValue.value = ''
    return
  }

  try {
    if (enableBatch.value) {
      // 批量转换：每行一条
      const lines = inputValue.value.split('\n')
      const results = lines.map(line => {
        if (!line.trim()) return ''
        return convertSingle(line.trim())
      })
      resultValue.value = results.join('\n')
    } else {
      // 单个转换
      resultValue.value = convertSingle(inputValue.value)
    }
  } catch (error) {
    resultValue.value = ''
    message.error(error instanceof Error ? error.message : '转换失败')
  }
}

// 单个转换
const convertSingle = (input: string): string => {
  if (conversionMode.value === 'string-to-ascii') {
    switch (outputFormat.value) {
      case 'decimal':
        return stringToAsciiDecimal(input)
      case 'hex':
        return stringToAsciiHex(input)
      case 'octal':
        return stringToAsciiOctal(input)
      case 'binary':
        return stringToAsciiBinary(input)
      default:
        return stringToAsciiDecimal(input)
    }
  } else {
    switch (outputFormat.value) {
      case 'decimal':
        return asciiDecimalToString(input)
      case 'hex':
        return asciiHexToString(input)
      case 'octal':
        return asciiOctalToString(input)
      case 'binary':
        return asciiBinaryToString(input)
      default:
        return asciiDecimalToString(input)
    }
  }
}

// 清空输入
const clearInput = () => {
  inputValue.value = ''
  resultValue.value = ''
}

// 粘贴
const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputValue.value = text
    handleInput()
    message.success('已粘贴')
  } catch (error) {
    message.error('无法访问剪贴板')
  }
}

// 复制结果
const copyResult = async () => {
  if (!resultValue.value) return
  try {
    await navigator.clipboard.writeText(resultValue.value)
    message.success('已复制到剪贴板')
  } catch (error) {
    message.error('复制失败')
  }
}

// 下载结果
const downloadResult = () => {
  if (!resultValue.value) return
  const blob = new Blob([resultValue.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ascii-${conversionMode.value}-${outputFormat.value}-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
  message.success('已下载')
}

// 加载示例
const loadExample = (type: string) => {
  const examples: Record<string, string> = {
    'hello': 'Hello World',
    'chinese': '你好世界',
    'mixed': '混合 Mixed 123',
    'ascii-decimal': '72 101 108 108 111 32 87 111 114 108 100',
    'ascii-hex': '48 65 6C 6C 6F 20 57 6F 72 6C 64',
  }
  inputValue.value = examples[type] || ''
  handleInput()
}

// 监听模式变化
watch(conversionMode, () => {
  resultValue.value = ''
  if (inputValue.value) {
    handleInput()
  }
})

// 监听格式变化
watch(outputFormat, () => {
  if (inputValue.value) {
    handleInput()
  }
})
</script>

<style scoped>
.ascii-tool {
  max-width: 900px;
  margin: 0 auto;
}

.tool-header {
  margin-bottom: 24px;
}

.tool-header h2 {
  font-size: 24px;
  margin-bottom: 8px;
}

.tool-description {
  color: var(--text-secondary);
  font-size: 14px;
}

.tool-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.conversion-mode {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.format-selector {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.input-section,
.output-section {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.input-header,
.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.batch-section {
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.preview-section {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.preview-header {
  margin-bottom: 16px;
}

.examples-section {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

:deep(.n-input) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
}

:deep(.n-statistic) {
  --n-label-font-size: 12px;
  --n-value-font-size: 18px;
}
</style>
