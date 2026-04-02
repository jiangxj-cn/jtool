<template>
  <div class="tool-container">
    <h2>📝 JSON 工具</h2>
    <p class="tool-description">格式化、校验、压缩、转义、JSONPath 查询、格式转换、差异比较等</p>
    
    <n-card class="tool-card">
      <n-tabs type="line" animated v-model:value="activeTab">
        <!-- 基础功能 -->
        <n-tab-pane name="basic" tab="基础功能">
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
          </n-space>
        </n-tab-pane>

        <!-- JSONPath 查询 -->
        <n-tab-pane name="jsonpath" tab="JSONPath 查询">
          <n-space vertical>
            <n-input
              v-model:value="inputJson"
              type="textarea"
              placeholder="输入 JSON..."
              :rows="4"
            />
            <n-input
              v-model:value="jsonpathQuery"
              placeholder="输入 JSONPath，如 $.store.book[*].author"
              clearable
            />
            <n-space>
              <n-button type="primary" @click="queryJsonPath">查询</n-button>
              <n-button @click="showJsonPathExamples = !showJsonPathExamples">示例</n-button>
            </n-space>
            <n-collapse-transition :show="showJsonPathExamples">
              <n-card size="small">
                <n-space vertical>
                  <div v-for="example in jsonPathExamples" :key="example.path">
                    <n-tag size="small">{{ example.name }}</n-tag>
                    <n-code :code="example.path" />
                    <small>{{ example.description }}</small>
                  </div>
                </n-space>
              </n-card>
            </n-collapse-transition>
          </n-space>
        </n-tab-pane>

        <!-- 格式转换 -->
        <n-tab-pane name="convert" tab="格式转换">
          <n-space vertical>
            <n-input
              v-model:value="inputJson"
              type="textarea"
              placeholder="输入 JSON 或其他格式..."
              :rows="4"
            />
            <n-space>
              <n-select
                v-model:value="convertSourceFormat"
                :options="sourceFormatOptions"
                style="width: 150px"
                placeholder="源格式"
              />
              <span style="font-size: 20px">→</span>
              <n-select
                v-model:value="convertTargetFormat"
                :options="targetFormatOptions"
                style="width: 150px"
                placeholder="目标格式"
              />
              <n-button type="primary" @click="convertFormat">转换</n-button>
            </n-space>
          </n-space>
        </n-tab-pane>

        <!-- 多语言转义 -->
        <n-tab-pane name="escape" tab="多语言转义">
          <n-space vertical>
            <n-input
              v-model:value="inputJson"
              type="textarea"
              placeholder="输入 JSON..."
              :rows="4"
            />
            <n-select
              v-model:value="escapeLanguage"
              :options="languageOptions"
              placeholder="选择编程语言"
            />
            <n-space>
              <n-button type="primary" @click="escapeForLanguage">转义</n-button>
              <n-button @click="unescapeFromLanguage">还原</n-button>
            </n-space>
          </n-space>
        </n-tab-pane>

        <!-- 差异比较 -->
        <n-tab-pane name="diff" tab="差异比较">
          <n-space vertical>
            <n-input
              v-model:value="inputJson1"
              type="textarea"
              placeholder="第一个 JSON..."
              :rows="4"
            />
            <n-input
              v-model:value="inputJson2"
              type="textarea"
              placeholder="第二个 JSON..."
              :rows="4"
            />
            <n-space>
              <n-button type="primary" @click="compareJson">比较</n-button>
              <n-select
                v-model:value="diffFormat"
                :options="diffFormatOptions"
                style="width: 120px"
              />
            </n-space>
          </n-space>
        </n-tab-pane>
      </n-tabs>

      <!-- 输出区域 -->
      <n-divider />
      <n-space vertical>
        <n-input
          v-model:value="outputJson"
          type="textarea"
          placeholder="结果..."
          :rows="8"
          readonly
        />
        <n-space v-if="resultInfo">
          <n-tag :type="resultInfo.success ? 'success' : 'error'">
            {{ resultInfo.success ? '✅ 成功' : '❌ 失败' }}
          </n-tag>
          <n-tag v-if="resultInfo.count">结果数：{{ resultInfo.count }}</n-tag>
          <n-tag v-if="resultInfo.hasChanges">
            {{ resultInfo.hasChanges ? '有差异' : '无差异' }}
          </n-tag>
        </n-space>
        <n-alert v-if="errorMsg" type="error">{{ errorMsg }}</n-alert>
        <n-alert v-if="successMsg" type="success">{{ successMsg }}</n-alert>
      </n-space>

      <!-- 操作按钮 -->
      <n-divider />
      <n-space>
        <n-button @click="copyOutput" :disabled="!outputJson">复制结果</n-button>
        <n-button @click="clearAll">清空</n-button>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import JSON5 from 'json5'
import {
  NCard, NInput, NButton, NSpace, NAlert, NTabs, NTabPane, NDivider,
  NTag, NSelect, NCollapseTransition, NCode
} from 'naive-ui'
import {
  jsonFormat, jsonValidate, jsonMinify,
  jsonEscape, jsonUnescape, jsonEscapeAll, jsonUnescapeAll,
  jsonPathQuery, getJsonPathExamples,
  jsonToYaml, yamlToJson, jsonToXml, xmlToJson, jsonToCsv, csvToJson, jsonToJsObject,
  jsonDiffCompare,
  jsonEscapeForLanguage, unescapeFromLanguage as unescapeFromLanguageCore, getSupportedLanguages
} from '@jtool/core'

const activeTab = ref('basic')
const inputJson = ref('')
const inputJson1 = ref('')
const inputJson2 = ref('')
const outputJson = ref('')
const errorMsg = ref('')
const successMsg = ref('')
const resultInfo = ref<{ success: boolean; count?: number; hasChanges?: boolean } | null>(null)

// JSONPath
const jsonpathQuery = ref('')
const showJsonPathExamples = ref(false)
const jsonPathExamples = ref(getJsonPathExamples())

// 格式转换
const convertSourceFormat = ref('json')
const convertTargetFormat = ref('yaml')
const sourceFormatOptions = [
  { label: 'JSON', value: 'json' },
  { label: 'YAML', value: 'yaml' },
  { label: 'XML', value: 'xml' },
  { label: 'CSV', value: 'csv' },
]
const targetFormatOptions = [
  { label: 'JSON', value: 'json' },
  { label: 'YAML', value: 'yaml' },
  { label: 'XML', value: 'xml' },
  { label: 'CSV', value: 'csv' },
  { label: 'JavaScript', value: 'js' },
]

// 多语言转义
const escapeLanguage = ref<'java' | 'go' | 'python' | 'javascript' | 'mybatis' | 'sql' | 'csharp' | 'rust'>('java')
const languageOptions = ref(getSupportedLanguages().map(lang => ({
  label: `${lang.label} - ${lang.description}`,
  value: lang.value
})))

// 差异比较
const diffFormat = ref('text')
const diffFormatOptions = [
  { label: '文本', value: 'text' },
  { label: 'JSON', value: 'json' },
]

const clearError = () => {
  errorMsg.value = ''
  successMsg.value = ''
  resultInfo.value = null
}

const format = () => {
  clearError()
  try {
    const obj = JSON5.parse(inputJson.value)
    outputJson.value = JSON.stringify(obj, null, 2)
    resultInfo.value = { success: true }
  } catch (e) {
    errorMsg.value = `❌ 无效 JSON: ${(e as Error).message}`
  }
}

const validate = () => {
  clearError()
  try {
    JSON5.parse(inputJson.value)
    outputJson.value = '✅ JSON 格式正确'
    resultInfo.value = { success: true }
  } catch (e) {
    errorMsg.value = `❌ 无效 JSON: ${(e as Error).message}`
  }
}

const compress = () => {
  clearError()
  try {
    const obj = JSON5.parse(inputJson.value)
    outputJson.value = JSON.stringify(obj)
    resultInfo.value = { success: true }
  } catch (e) {
    errorMsg.value = `❌ 无效 JSON: ${(e as Error).message}`
  }
}

const escapeStr = () => {
  clearError()
  try {
    outputJson.value = jsonEscape(inputJson.value)
    resultInfo.value = { success: true }
  } catch (e) {
    errorMsg.value = `转义失败：${(e as Error).message}`
  }
}

const unescapeStr = () => {
  clearError()
  try {
    outputJson.value = jsonUnescape(inputJson.value)
    resultInfo.value = { success: true }
  } catch (e) {
    errorMsg.value = `去转义失败：${(e as Error).message}`
  }
}

const escapeAll = () => {
  clearError()
  outputJson.value = jsonEscapeAll(inputJson.value)
  resultInfo.value = { success: true }
}

const unescapeAll = () => {
  clearError()
  outputJson.value = jsonUnescapeAll(inputJson.value)
  resultInfo.value = { success: true }
}

const queryJsonPath = () => {
  clearError()
  const result = jsonPathQuery(inputJson.value, jsonpathQuery.value)
  if (result.success) {
    outputJson.value = result.result || ''
    resultInfo.value = { success: true, count: result.resultCount }
  } else {
    errorMsg.value = result.error || '查询失败'
  }
}

const convertFormat = () => {
  clearError()
  const source = convertSourceFormat.value
  const target = convertTargetFormat.value
  
  if (source === target) {
    errorMsg.value = '源格式和目标格式相同'
    return
  }
  
  let result: any
  
  try {
    if (source === 'json') {
      if (target === 'yaml') result = jsonToYaml(inputJson.value)
      else if (target === 'xml') result = jsonToXml(inputJson.value)
      else if (target === 'csv') result = jsonToCsv(inputJson.value)
      else if (target === 'js') result = jsonToJsObject(inputJson.value)
    } else if (target === 'json') {
      if (source === 'yaml') result = yamlToJson(inputJson.value)
      else if (source === 'xml') result = xmlToJson(inputJson.value)
      else if (source === 'csv') result = csvToJson(inputJson.value)
    }
    
    if (result) {
      if (result.success) {
        outputJson.value = result.result || ''
        resultInfo.value = { success: true }
        successMsg.value = `✅ 已从 ${source.toUpperCase()} 转换到 ${target.toUpperCase()}`
      } else {
        errorMsg.value = result.error || '转换失败'
      }
    } else {
      errorMsg.value = '不支持的转换组合'
    }
  } catch (e) {
    errorMsg.value = `转换失败：${(e as Error).message}`
  }
}

const escapeForLanguage = () => {
  clearError()
  const result = jsonEscapeForLanguage(inputJson.value, escapeLanguage.value)
  if (result.success) {
    outputJson.value = result.result || ''
    resultInfo.value = { success: true }
  } else {
    errorMsg.value = result.error || '转义失败'
  }
}

const unescapeFromLanguage = () => {
  clearError()
  const result = unescapeFromLanguageCore(inputJson.value, escapeLanguage.value)
  if (result.success) {
    outputJson.value = result.result || ''
    resultInfo.value = { success: true }
  } else {
    errorMsg.value = result.error || '还原失败'
  }
}

const compareJson = () => {
  clearError()
  const result = jsonDiffCompare(inputJson1.value, inputJson2.value, diffFormat.value as any)
  if (result.success) {
    outputJson.value = result.result || ''
    resultInfo.value = { success: true, hasChanges: result.hasChanges }
    if (!result.hasChanges) {
      successMsg.value = '✅ 两个 JSON 完全相同'
    }
  } else {
    errorMsg.value = result.error || '比较失败'
  }
}

const copyOutput = async () => {
  if (outputJson.value) {
    await navigator.clipboard.writeText(outputJson.value)
    successMsg.value = '✅ 已复制到剪贴板'
  }
}

const clearAll = () => {
  inputJson.value = ''
  inputJson1.value = ''
  inputJson2.value = ''
  outputJson.value = ''
  jsonpathQuery.value = ''
  errorMsg.value = ''
  successMsg.value = ''
  resultInfo.value = null
}
</script>

<style scoped>
.tool-container { max-width: 100%; margin: 0 auto; }
@media (min-width: 1200px) { .tool-container { max-width: 1200px; } }
@media (min-width: 1600px) { .tool-container { max-width: 1600px; } }
h2 { font-size: 24px; margin-bottom: 8px; }
.tool-description { color: var(--text-secondary); margin-bottom: 20px; }
.tool-card { background: var(--bg-secondary); border: 1px solid var(--border); }
small { color: var(--text-secondary); display: block; margin-top: 4px; }
</style>
