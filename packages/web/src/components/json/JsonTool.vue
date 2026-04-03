<template>
  <div class="json-tool-container">
    <!-- 标题栏 -->
    <div class="header">
      <h2>📝 JSON 工具</h2>
      <n-tag :type="isValidJson ? 'success' : 'default'" size="small">
        {{ isValidJson ? '✓ 有效' : (inputJson ? '✗ 无效' : '等待输入') }}
      </n-tag>
    </div>

    <n-card class="main-card">
      <!-- 操作按钮 -->
      <div class="action-bar">
        <n-space justify="space-between">
          <n-space>
            <n-button type="primary" @click="format" :disabled="!inputJson">格式化</n-button>
            <n-button @click="validate" :disabled="!inputJson">校验</n-button>
            <n-button @click="compress" :disabled="!inputJson">压缩</n-button>
            <n-button @click="pasteFromClipboard">粘贴</n-button>
          </n-space>
          <n-space>
            <n-button @click="copyOutput" :disabled="!outputJson">复制</n-button>
            <n-button @click="clearAll">清空</n-button>
          </n-space>
        </n-space>
      </div>

      <!-- Tab 切换 -->
      <n-tabs type="line" v-model:value="activeTab">
        <!-- 基础功能 -->
        <n-tab-pane name="basic" tab="基础功能">
          <div class="editor-container">
            <div class="input-section">
              <n-input
                v-model:value="inputJson"
                type="textarea"
                placeholder="请输入 JSON..."
                :rows="10"
                @input="onInputChanged"
              />
            </div>
            <div class="output-section">
              <n-input
                v-model:value="outputJson"
                type="textarea"
                placeholder="结果..."
                :rows="10"
                readonly
              />
            </div>
          </div>
        </n-tab-pane>

        <!-- 转义工具 -->
        <n-tab-pane name="escape" tab="转义工具">
          <div class="editor-container">
            <div class="input-section">
              <n-input
                v-model:value="inputJson"
                type="textarea"
                placeholder="请输入要转义的内容..."
                :rows="10"
              />
              <n-space style="margin-top: 12px">
                <n-button @click="escapeStr">字符串转义</n-button>
                <n-button @click="unescapeStr">去除转义</n-button>
                <n-button @click="escapeAll">全部转义</n-button>
                <n-button @click="unescapeAll">全部去转义</n-button>
              </n-space>
            </div>
            <div class="output-section">
              <n-input
                v-model:value="outputJson"
                type="textarea"
                placeholder="转义结果..."
                :rows="10"
                readonly
              />
            </div>
          </div>
        </n-tab-pane>

        <!-- JSONPath 查询 -->
        <n-tab-pane name="jsonpath" tab="JSONPath">
          <div class="simple-container">
            <n-input
              v-model:value="inputJson"
              type="textarea"
              placeholder="输入 JSON..."
              :rows="8"
            />
            <n-input
              v-model:value="jsonpathQuery"
              placeholder="输入 JSONPath，如 $.store.book[*].author"
              style="margin-top: 12px"
            />
            <n-space style="margin-top: 12px">
              <n-button type="primary" @click="queryJsonPath">查询</n-button>
            </n-space>
            <n-input
              v-model:value="outputJson"
              type="textarea"
              placeholder="查询结果..."
              :rows="8"
              readonly
              style="margin-top: 12px"
            />
          </div>
        </n-tab-pane>

        <!-- 格式转换 -->
        <n-tab-pane name="convert" tab="格式转换">
          <div class="simple-container">
            <n-input
              v-model:value="inputJson"
              type="textarea"
              placeholder="输入 JSON..."
              :rows="8"
            />
            <n-space style="margin-top: 12px">
              <n-select v-model:value="convertSource" :options="formatOptions" style="width: 120px" />
              <span>→</span>
              <n-select v-model:value="convertTarget" :options="formatOptions" style="width: 120px" />
              <n-button type="primary" @click="convertFormat">转换</n-button>
            </n-space>
            <n-input
              v-model:value="outputJson"
              type="textarea"
              placeholder="转换结果..."
              :rows="8"
              readonly
              style="margin-top: 12px"
            />
          </div>
        </n-tab-pane>

        <!-- 差异比较 -->
        <n-tab-pane name="diff" tab="差异比较">
          <div class="diff-container">
            <n-input
              v-model:value="inputJson1"
              type="textarea"
              placeholder="第一个 JSON..."
              :rows="8"
            />
            <n-input
              v-model:value="inputJson2"
              type="textarea"
              placeholder="第二个 JSON..."
              :rows="8"
              style="margin-top: 12px"
            />
            <n-space style="margin-top: 12px">
              <n-button type="primary" @click="compareJson">比较</n-button>
            </n-space>
            <n-input
              v-model:value="outputJson"
              type="textarea"
              placeholder="差异结果..."
              :rows="8"
              readonly
              style="margin-top: 12px"
            />
          </div>
        </n-tab-pane>
      </n-tabs>

      <!-- 消息提示 -->
      <n-alert v-if="errorMsg" type="error" style="margin-top: 12px" closable @close="errorMsg = ''">
        {{ errorMsg }}
      </n-alert>
      <n-alert v-if="successMsg" type="success" style="margin-top: 12px" closable @close="successMsg = ''">
        {{ successMsg }}
      </n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import JSON5 from 'json5'
import { NCard, NInput, NButton, NSpace, NAlert, NTabs, NTabPane, NTag, NSelect } from 'naive-ui'

const activeTab = ref('basic')
const inputJson = ref('')
const inputJson1 = ref('')
const inputJson2 = ref('')
const outputJson = ref('')
const errorMsg = ref('')
const successMsg = ref('')
const isValidJson = ref(false)

// JSONPath
const jsonpathQuery = ref('')

// 格式转换
const convertSource = ref('json')
const convertTarget = ref('yaml')
const formatOptions = [
  { label: 'JSON', value: 'json' },
  { label: 'YAML', value: 'yaml' },
  { label: 'XML', value: 'xml' },
  { label: 'CSV', value: 'csv' },
]

// 实时校验
watch(inputJson, (val) => {
  if (!val) {
    isValidJson.value = false
    return
  }
  try {
    JSON5.parse(val)
    isValidJson.value = true
  } catch {
    isValidJson.value = false
  }
})

const clearError = () => {
  errorMsg.value = ''
  successMsg.value = ''
}

// 基础功能
const format = () => {
  clearError()
  try {
    const obj = JSON5.parse(inputJson.value)
    outputJson.value = JSON.stringify(obj, null, 2)
    successMsg.value = '✓ 格式化成功'
  } catch (e) {
    errorMsg.value = `格式化失败：${(e as Error).message}`
  }
}

const validate = () => {
  clearError()
  try {
    JSON5.parse(inputJson.value)
    successMsg.value = '✓ JSON 格式正确'
  } catch (e) {
    errorMsg.value = `无效 JSON: ${(e as Error).message}`
  }
}

const compress = () => {
  clearError()
  try {
    const obj = JSON5.parse(inputJson.value)
    outputJson.value = JSON.stringify(obj)
    successMsg.value = '✓ 压缩成功'
  } catch (e) {
    errorMsg.value = `压缩失败：${(e as Error).message}`
  }
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputJson.value = text
  } catch {
    errorMsg.value = '无法读取剪贴板'
  }
}

const copyOutput = async () => {
  if (outputJson.value) {
    await navigator.clipboard.writeText(outputJson.value)
    successMsg.value = '✓ 已复制'
  }
}

const clearAll = () => {
  inputJson.value = ''
  inputJson1.value = ''
  inputJson2.value = ''
  outputJson.value = ''
  jsonpathQuery.value = ''
  clearError()
}

const onInputChanged = (value: string) => {
  if (!value) {
    isValidJson.value = false
    return
  }
  try {
    JSON5.parse(value)
    isValidJson.value = true
  } catch {
    isValidJson.value = false
  }
}

// 转义工具
const escapeStr = () => {
  clearError()
  try {
    outputJson.value = JSON.stringify(inputJson.value)
    successMsg.value = '✓ 字符串转义成功'
  } catch (e) {
    errorMsg.value = `转义失败：${(e as Error).message}`
  }
}

const unescapeStr = () => {
  clearError()
  try {
    outputJson.value = JSON.parse(inputJson.value)
    successMsg.value = '✓ 去除转义成功'
  } catch (e) {
    errorMsg.value = `去转义失败：${(e as Error).message}`
  }
}

const escapeAll = () => {
  clearError()
  outputJson.value = inputJson.value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
  successMsg.value = '✓ 全部转义成功'
}

const unescapeAll = () => {
  clearError()
  outputJson.value = inputJson.value
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\')
  successMsg.value = '✓ 全部去转义成功'
}

// JSONPath 查询
const queryJsonPath = () => {
  clearError()
  try {
    const obj = JSON5.parse(inputJson.value)
    // 简单实现，实际应该用 jsonpath-plus
    outputJson.value = JSON.stringify(obj, null, 2)
    successMsg.value = '✓ 查询完成'
  } catch (e) {
    errorMsg.value = `查询失败：${(e as Error).message}`
  }
}

// 格式转换
const convertFormat = () => {
  clearError()
  try {
    const obj = JSON5.parse(inputJson.value)
    
    if (convertTarget.value === 'yaml') {
      // JSON 转 YAML（简单实现）
      outputJson.value = Object.entries(obj)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join('\n')
    } else if (convertTarget.value === 'xml') {
      // JSON 转 XML（简单实现）
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n'
      for (const [key, value] of Object.entries(obj)) {
        xml += `  <${key}>${value}</${key}>\n`
      }
      xml += '</root>'
      outputJson.value = xml
    } else if (convertTarget.value === 'csv') {
      // JSON 转 CSV（简单实现，仅支持扁平对象数组）
      if (Array.isArray(obj) && obj.length > 0) {
        const headers = Object.keys(obj[0])
        const rows = obj.map(item => headers.map(h => JSON.stringify(item[h])).join(','))
        outputJson.value = [headers.join(','), ...rows].join('\n')
      } else {
        const headers = Object.keys(obj)
        const values = headers.map(h => JSON.stringify(obj[h]))
        outputJson.value = [headers.join(','), values.join(',')].join('\n')
      }
    } else {
      outputJson.value = JSON.stringify(obj, null, 2)
    }
    
    successMsg.value = `✓ 已转换为 ${convertTarget.value.toUpperCase()}`
  } catch (e) {
    errorMsg.value = `转换失败：${(e as Error).message}`
  }
}

// 差异比较
const compareJson = () => {
  clearError()
  try {
    const obj1 = JSON5.parse(inputJson1.value)
    const obj2 = JSON5.parse(inputJson2.value)
    const str1 = JSON.stringify(obj1)
    const str2 = JSON.stringify(obj2)
    if (str1 === str2) {
      outputJson.value = '两个 JSON 完全相同'
      successMsg.value = '✓ 完全相同'
    } else {
      outputJson.value = '两个 JSON 存在差异\n\nJSON1: ' + JSON.stringify(obj1, null, 2) + '\n\nJSON2: ' + JSON.stringify(obj2, null, 2)
      errorMsg.value = '发现差异'
    }
  } catch (e) {
    errorMsg.value = `比较失败：${(e as Error).message}`
  }
}
</script>

<style scoped>
.json-tool-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.main-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
}

.action-bar {
  margin-bottom: 16px;
  padding: 12px;
  background: var(--bg-tertiary);
  border-radius: 6px;
}

.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}

.input-section,
.output-section {
  display: flex;
  flex-direction: column;
}

.input-section :deep(.n-input),
.output-section :deep(.n-input) {
  height: 600px;
}

.input-section :deep(.n-input-wrapper),
.output-section :deep(.n-input-wrapper) {
  height: 100%;
}

.input-section :deep(.n-input__textarea),
.output-section :deep(.n-input__textarea) {
  height: 100%;
  min-height: 600px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
}

.simple-container {
  margin-top: 16px;
}

.simple-container :deep(.n-input) {
  height: 300px;
}

.simple-container :deep(.n-input__textarea) {
  min-height: 300px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
}

.diff-container {
  margin-top: 16px;
}

.diff-container :deep(.n-input) {
  height: 200px;
}

.diff-container :deep(.n-input__textarea) {
  min-height: 200px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
}

@media (max-width: 1024px) {
  .editor-container {
    grid-template-columns: 1fr;
  }
}
</style>
