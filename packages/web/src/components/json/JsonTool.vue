<template>
  <div class="tool-container">
    <div class="tool-header">
      <h2>📝 JSON 工具</h2>
      <p class="tool-description">格式化、校验、压缩、转义、JSONPath 查询、格式转换、差异比较等</p>
    </div>
    
    <n-card class="tool-card">
      <!-- 工具栏 -->
      <div class="toolbar">
        <n-space align="center">
          <n-tag type="info" size="small">
            <template #icon><n-icon :component="DocumentTextOutline" /></template>
            {{ activeTabLabel }}
          </n-tag>
          <n-tag v-if="isValidJson" type="success" size="small">
            <template #icon><n-icon :component="CheckmarkCircleOutline" /></template>
            JSON 有效
          </n-tag>
          <n-tag v-else-if="inputJson" type="error" size="small">
            <template #icon><n-icon :component="CloseCircleOutline" /></template>
            JSON 无效
          </n-tag>
          <n-space style="margin-left: auto">
            <n-button size="small" @click="format" :disabled="!inputJson">
              <template #icon><n-icon :component="FormatSize" /></template>
              格式化
              <template #shortcut>Ctrl+S</template>
            </n-button>
            <n-button size="small" @click="copyOutput" :disabled="!outputJson">
              <template #icon><n-icon :component="CopyOutline" /></template>
              复制
            </n-button>
            <n-button size="small" @click="clearAll">
              <template #icon><n-icon :component="TrashOutline" /></template>
              清空
            </n-button>
          </n-space>
        </n-space>
      </div>

      <n-tabs type="line" animated v-model:value="activeTab" @update:value="onTabChange">
        <!-- 基础功能 -->
        <n-tab-pane name="basic" tab="基础功能">
          <div class="split-layout">
            <!-- 左侧输入 -->
            <div class="input-panel">
              <div class="panel-header">
                <span class="panel-title">
                  <n-icon :component="CreateOutline" /> 输入
                </span>
                <n-space>
                  <n-button size="tiny" @click="pasteFromClipboard">
                    <template #icon><n-icon :component="ClipboardOutline" /></template>
                    粘贴
                  </n-button>
                </n-space>
              </div>
              <div class="editor-wrapper">
                <div class="monaco-editor" ref="inputEditorRef"></div>
                <div v-if="!useMonaco" class="fallback-textarea">
                  <n-input
                    v-model:value="inputJson"
                    type="textarea"
                    placeholder="输入 JSON..."
                    :rows="15"
                    @input="onInputChanged"
                  />
                </div>
              </div>
              <div class="panel-footer">
                <n-space>
                  <n-button type="primary" size="small" @click="format">
                    <template #icon><n-icon :component="FormatSize" /></template>
                    格式化
                  </n-button>
                  <n-button size="small" @click="validate">
                    <template #icon><n-icon :component="CheckmarkCircleOutline" /></template>
                    校验
                  </n-button>
                  <n-button size="small" @click="compress">
                    <template #icon><n-icon :component="FlashOutline" /></template>
                    压缩
                  </n-button>
                </n-space>
              </div>
            </div>

            <!-- 右侧输出 -->
            <div class="output-panel">
              <div class="panel-header">
                <span class="panel-title">
                  <n-icon :component="DocumentTextOutline" /> 输出
                </span>
                <n-space>
                  <n-button size="tiny" type="success" @click="copyOutput" :disabled="!outputJson">
                    <template #icon><n-icon :component="CopyOutline" /></template>
                    复制
                  </n-button>
                </n-space>
              </div>
              <div class="editor-wrapper">
                <div class="monaco-editor" ref="outputEditorRef"></div>
                <div v-if="!useMonaco" class="fallback-textarea">
                  <n-input
                    v-model:value="outputJson"
                    type="textarea"
                    placeholder="结果..."
                    :rows="15"
                    readonly
                  />
                </div>
              </div>
              <div class="panel-footer">
                <n-space>
                  <n-tag :type="resultInfo?.success ? 'success' : 'default'" size="small">
                    {{ resultInfo?.success ? '✅ 成功' : '等待操作' }}
                  </n-tag>
                  <n-tag v-if="resultInfo?.count" size="small">结果数：{{ resultInfo.count }}</n-tag>
                </n-space>
              </div>
            </div>
          </div>
        </n-tab-pane>

        <!-- 转义工具 -->
        <n-tab-pane name="escape" tab="转义工具">
          <div class="split-layout">
            <div class="input-panel">
              <div class="panel-header">
                <span class="panel-title">
                  <n-icon :component="ShieldCheckmarkOutline" /> 转义输入
                </span>
              </div>
              <div class="editor-wrapper">
                <div class="monaco-editor" ref="escapeInputEditorRef"></div>
                <div v-if="!useMonaco" class="fallback-textarea">
                  <n-input
                    v-model:value="inputJson"
                    type="textarea"
                    placeholder="输入 JSON 或字符串..."
                    :rows="15"
                  />
                </div>
              </div>
              <div class="panel-footer">
                <n-space>
                  <n-button type="primary" size="small" @click="escapeStr">
                    <template #icon><n-icon :component="LockClosedOutline" /></template>
                    字符串转义
                  </n-button>
                  <n-button size="small" @click="unescapeStr">
                    <template #icon><n-icon :component="LockOpenOutline" /></template>
                    去除转义
                  </n-button>
                  <n-button size="small" @click="escapeAll">
                    <template #icon><n-icon :component="ShieldCheckmarkOutline" /></template>
                    全部转义
                  </n-button>
                  <n-button size="small" @click="unescapeAll">
                    <template #icon><n-icon :component="ShieldOutline" /></template>
                    全部去转义
                  </n-button>
                </n-space>
              </div>
            </div>

            <div class="output-panel">
              <div class="panel-header">
                <span class="panel-title">
                  <n-icon :component="DocumentTextOutline" /> 转义结果
                </span>
                <n-button size="tiny" type="success" @click="copyOutput" :disabled="!outputJson">
                  <template #icon><n-icon :component="CopyOutline" /></template>
                  复制
                </n-button>
              </div>
              <div class="editor-wrapper">
                <div class="monaco-editor" ref="escapeOutputEditorRef"></div>
                <div v-if="!useMonaco" class="fallback-textarea">
                  <n-input
                    v-model:value="outputJson"
                    type="textarea"
                    placeholder="转义结果..."
                    :rows="15"
                    readonly
                  />
                </div>
              </div>
              <div class="panel-footer">
                <n-tag :type="resultInfo?.success ? 'success' : 'default'" size="small">
                  {{ resultInfo?.success ? '✅ 成功' : '等待操作' }}
                </n-tag>
              </div>
            </div>
          </div>
        </n-tab-pane>

        <!-- JSONPath 查询 -->
        <n-tab-pane name="jsonpath" tab="JSONPath 查询">
          <div class="split-layout">
            <div class="input-panel">
              <div class="panel-header">
                <span class="panel-title">
                  <n-icon :component="SearchOutline" /> JSON 输入
                </span>
              </div>
              <div class="editor-wrapper">
                <div class="monaco-editor" ref="jsonpathInputEditorRef"></div>
                <div v-if="!useMonaco" class="fallback-textarea">
                  <n-input
                    v-model:value="inputJson"
                    type="textarea"
                    placeholder="输入 JSON..."
                    :rows="10"
                  />
                </div>
              </div>
              <div class="panel-footer">
                <n-input
                  v-model:value="jsonpathQuery"
                  placeholder="输入 JSONPath，如 $.store.book[*].author"
                  clearable
                  size="small"
                >
                  <template #prefix>
                    <n-icon :component="SearchOutline" />
                  </template>
                </n-input>
                <n-space style="margin-top: 8px">
                  <n-button type="primary" size="small" @click="queryJsonPath">
                    <template #icon><n-icon :component="SearchOutline" /></template>
                    查询
                  </n-button>
                  <n-button size="small" @click="showJsonPathExamples = !showJsonPathExamples">
                    <template #icon><n-icon :component="HelpCircleOutline" /></template>
                    示例
                  </n-button>
                </n-space>
              </div>
            </div>

            <div class="output-panel">
              <div class="panel-header">
                <span class="panel-title">
                  <n-icon :component="DocumentTextOutline" /> 查询结果
                </span>
                <n-button size="tiny" type="success" @click="copyOutput" :disabled="!outputJson">
                  <template #icon><n-icon :component="CopyOutline" /></template>
                  复制
                </n-button>
              </div>
              <div class="editor-wrapper">
                <div class="monaco-editor" ref="jsonpathOutputEditorRef"></div>
                <div v-if="!useMonaco" class="fallback-textarea">
                  <n-input
                    v-model:value="outputJson"
                    type="textarea"
                    placeholder="查询结果..."
                    :rows="10"
                    readonly
                  />
                </div>
              </div>
              <div class="panel-footer">
                <n-tag v-if="resultInfo?.count" size="small">结果数：{{ resultInfo.count }}</n-tag>
              </div>
            </div>
          </div>

          <n-collapse-transition :show="showJsonPathExamples">
            <n-card size="small" class="examples-card">
              <n-space vertical>
                <div v-for="example in jsonPathExamples" :key="example.path" class="example-item">
                  <n-space align="center">
                    <n-tag size="small">{{ example.name }}</n-tag>
                    <n-code :code="example.path" />
                  </n-space>
                  <small>{{ example.description }}</small>
                </div>
              </n-space>
            </n-card>
          </n-collapse-transition>
        </n-tab-pane>

        <!-- 格式转换 -->
        <n-tab-pane name="convert" tab="格式转换">
          <div class="split-layout">
            <div class="input-panel">
              <div class="panel-header">
                <span class="panel-title">
                  <n-icon :component="SwapHorizontalOutline" /> 输入
                </span>
              </div>
              <div class="editor-wrapper">
                <div class="monaco-editor" ref="convertInputEditorRef"></div>
                <div v-if="!useMonaco" class="fallback-textarea">
                  <n-input
                    v-model:value="inputJson"
                    type="textarea"
                    placeholder="输入 JSON 或其他格式..."
                    :rows="15"
                  />
                </div>
              </div>
              <div class="panel-footer">
                <n-space align="center">
                  <n-select
                    v-model:value="convertSourceFormat"
                    :options="sourceFormatOptions"
                    size="small"
                    style="width: 120px"
                    placeholder="源格式"
                  />
                  <n-icon :component="ArrowForwardOutline" size="20" />
                  <n-select
                    v-model:value="convertTargetFormat"
                    :options="targetFormatOptions"
                    size="small"
                    style="width: 120px"
                    placeholder="目标格式"
                  />
                  <n-button type="primary" size="small" @click="convertFormat">
                    <template #icon><n-icon :component="SwapHorizontalOutline" /></template>
                    转换
                  </n-button>
                </n-space>
              </div>
            </div>

            <div class="output-panel">
              <div class="panel-header">
                <span class="panel-title">
                  <n-icon :component="DocumentTextOutline" /> 转换结果
                </span>
                <n-button size="tiny" type="success" @click="copyOutput" :disabled="!outputJson">
                  <template #icon><n-icon :component="CopyOutline" /></template>
                  复制
                </n-button>
              </div>
              <div class="editor-wrapper">
                <div class="monaco-editor" ref="convertOutputEditorRef"></div>
                <div v-if="!useMonaco" class="fallback-textarea">
                  <n-input
                    v-model:value="outputJson"
                    type="textarea"
                    placeholder="转换结果..."
                    :rows="15"
                    readonly
                  />
                </div>
              </div>
              <div class="panel-footer">
                <n-tag :type="resultInfo?.success ? 'success' : 'default'" size="small">
                  {{ resultInfo?.success ? '✅ 成功' : '等待操作' }}
                </n-tag>
              </div>
            </div>
          </div>
        </n-tab-pane>

        <!-- 多语言转义 -->
        <n-tab-pane name="language" tab="多语言转义">
          <div class="split-layout">
            <div class="input-panel">
              <div class="panel-header">
                <span class="panel-title">
                  <n-icon :component="CodeSlashOutline" /> 输入
                </span>
              </div>
              <div class="editor-wrapper">
                <div class="monaco-editor" ref="langInputEditorRef"></div>
                <div v-if="!useMonaco" class="fallback-textarea">
                  <n-input
                    v-model:value="inputJson"
                    type="textarea"
                    placeholder="输入 JSON..."
                    :rows="15"
                  />
                </div>
              </div>
              <div class="panel-footer">
                <n-space align="center">
                  <n-select
                    v-model:value="escapeLanguage"
                    :options="languageOptions"
                    size="small"
                    style="width: 200px"
                    placeholder="选择编程语言"
                  />
                  <n-button type="primary" size="small" @click="escapeForLanguage">
                    <template #icon><n-icon :component="LockClosedOutline" /></template>
                    转义
                  </n-button>
                  <n-button size="small" @click="unescapeFromLanguage">
                    <template #icon><n-icon :component="LockOpenOutline" /></template>
                    还原
                  </n-button>
                </n-space>
              </div>
            </div>

            <div class="output-panel">
              <div class="panel-header">
                <span class="panel-title">
                  <n-icon :component="DocumentTextOutline" /> 结果
                </span>
                <n-button size="tiny" type="success" @click="copyOutput" :disabled="!outputJson">
                  <template #icon><n-icon :component="CopyOutline" /></template>
                  复制
                </n-button>
              </div>
              <div class="editor-wrapper">
                <div class="monaco-editor" ref="langOutputEditorRef"></div>
                <div v-if="!useMonaco" class="fallback-textarea">
                  <n-input
                    v-model:value="outputJson"
                    type="textarea"
                    placeholder="结果..."
                    :rows="15"
                    readonly
                  />
                </div>
              </div>
              <div class="panel-footer">
                <n-tag :type="resultInfo?.success ? 'success' : 'default'" size="small">
                  {{ resultInfo?.success ? '✅ 成功' : '等待操作' }}
                </n-tag>
              </div>
            </div>
          </div>
        </n-tab-pane>

        <!-- 差异比较 -->
        <n-tab-pane name="diff" tab="差异比较">
          <div class="diff-layout">
            <div class="diff-inputs">
              <div class="diff-item">
                <div class="panel-header">
                  <span class="panel-title">
                    <n-icon :component="DocumentOutline" /> JSON 1
                  </span>
                </div>
                <div class="editor-wrapper">
                  <div class="monaco-editor" ref="diff1EditorRef"></div>
                  <div v-if="!useMonaco" class="fallback-textarea">
                    <n-input
                      v-model:value="inputJson1"
                      type="textarea"
                      placeholder="第一个 JSON..."
                      :rows="8"
                    />
                  </div>
                </div>
              </div>
              <div class="diff-item">
                <div class="panel-header">
                  <span class="panel-title">
                    <n-icon :component="DocumentOutline" /> JSON 2
                  </span>
                </div>
                <div class="editor-wrapper">
                  <div class="monaco-editor" ref="diff2EditorRef"></div>
                  <div v-if="!useMonaco" class="fallback-textarea">
                    <n-input
                      v-model:value="inputJson2"
                      type="textarea"
                      placeholder="第二个 JSON..."
                      :rows="8"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="diff-actions">
              <n-space vertical align="center">
                <n-button type="primary" @click="compareJson">
                  <template #icon><n-icon :component="GitCompareOutline" /></template>
                  比较差异
                </n-button>
                <n-select
                  v-model:value="diffFormat"
                  :options="diffFormatOptions"
                  size="small"
                  style="width: 120px"
                />
              </n-space>
            </div>
            <div class="diff-output">
              <div class="panel-header">
                <span class="panel-title">
                  <n-icon :component="GitCompareOutline" /> 比较结果
                </span>
                <n-button size="tiny" type="success" @click="copyOutput" :disabled="!outputJson">
                  <template #icon><n-icon :component="CopyOutline" /></template>
                  复制
                </n-button>
              </div>
              <div class="editor-wrapper">
                <div class="monaco-editor" ref="diffOutputEditorRef"></div>
                <div v-if="!useMonaco" class="fallback-textarea">
                  <n-input
                    v-model:value="outputJson"
                    type="textarea"
                    placeholder="比较结果..."
                    :rows="8"
                    readonly
                  />
                </div>
              </div>
              <div class="panel-footer">
                <n-space>
                  <n-tag :type="resultInfo?.success ? 'success' : 'default'" size="small">
                    {{ resultInfo?.success ? '✅ 成功' : '等待操作' }}
                  </n-tag>
                  <n-tag v-if="resultInfo?.hasChanges !== undefined" size="small" :type="resultInfo.hasChanges ? 'warning' : 'success'">
                    {{ resultInfo.hasChanges ? '有差异' : '无差异' }}
                  </n-tag>
                </n-space>
              </div>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>

      <!-- 错误和成功信息 -->
      <n-alert v-if="errorMsg" type="error" :bordered="false" closable @close="errorMsg = ''">
        {{ errorMsg }}
      </n-alert>
      <n-alert v-if="successMsg" type="success" :bordered="false" closable @close="successMsg = ''">
        {{ successMsg }}
      </n-alert>

    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import JSON5 from 'json5'
import {
  NCard, NInput, NButton, NSpace, NAlert, NTabs, NTabPane, NDivider,
  NTag, NSelect, NCollapseTransition, NCode, NModal, NList, NListItem, NEmpty, NIcon
} from 'naive-ui'
import {
  DocumentTextOutline, CheckmarkCircleOutline, CloseCircleOutline,
  ShieldCheckmarkOutline, LockClosedOutline, LockOpenOutline, ShieldOutline,
  SearchOutline, HelpCircleOutline, SwapHorizontalOutline, ArrowForwardOutline,
  CodeSlashOutline, DocumentOutline, GitCompareOutline, TextOutline
} from '@vicons/ionicons5'

// 使用 TextOutline 替代不存在的 FormatSize
const FormatSize = TextOutline
import {
  jsonFormat, jsonValidate, jsonMinify,
  jsonEscape, jsonUnescape, jsonEscapeAll, jsonUnescapeAll,
  jsonPathQuery, getJsonPathExamples,
  jsonToYaml, yamlToJson, jsonToXml, xmlToJson, jsonToCsv, csvToJson, jsonToJsObject,
  jsonDiffCompare,
  jsonEscapeForLanguage, unescapeFromLanguage as unescapeFromLanguageCore, getSupportedLanguages
} from '@jtool/core'

// Tab 配置
const activeTab = ref('basic')
const activeTabLabel = computed(() => {
  const tabs: Record<string, string> = {
    basic: '基础功能',
    escape: '转义工具',
    jsonpath: 'JSONPath 查询',
    convert: '格式转换',
    language: '多语言转义',
    diff: '差异比较'
  }
  return tabs[activeTab.value] || ''
})

// 数据状态
const inputJson = ref('')
const inputJson1 = ref('')
const inputJson2 = ref('')
const outputJson = ref('')
const errorMsg = ref('')
const successMsg = ref('')
const resultInfo = ref<{ success: boolean; count?: number; hasChanges?: boolean } | null>(null)
const isValidJson = ref(false)

// Monaco Editor 配置
const useMonaco = ref(false)
const inputEditorRef = ref<HTMLElement | null>(null)
const outputEditorRef = ref<HTMLElement | null>(null)
const escapeInputEditorRef = ref<HTMLElement | null>(null)
const escapeOutputEditorRef = ref<HTMLElement | null>(null)
const jsonpathInputEditorRef = ref<HTMLElement | null>(null)
const jsonpathOutputEditorRef = ref<HTMLElement | null>(null)
const convertInputEditorRef = ref<HTMLElement | null>(null)
const convertOutputEditorRef = ref<HTMLElement | null>(null)
const langInputEditorRef = ref<HTMLElement | null>(null)
const langOutputEditorRef = ref<HTMLElement | null>(null)
const diff1EditorRef = ref<HTMLElement | null>(null)
const diff2EditorRef = ref<HTMLElement | null>(null)
const diffOutputEditorRef = ref<HTMLElement | null>(null)

let inputEditorInstance: any = null
let outputEditorInstance: any = null

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

// 清空错误
const clearError = () => {
  errorMsg.value = ''
  successMsg.value = ''
  resultInfo.value = null
}

// 实时校验 JSON
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

// 监听输入变化
watch([inputJson, inputJson1, inputJson2], () => {
  onInputChanged(inputJson.value)
})

// 快捷键支持
const handleKeyDown = (e: KeyboardEvent) => {
  // Ctrl+S 格式化
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault()
    format()
  }
  // Ctrl+Shift+C 复制输出
  if (e.ctrlKey && e.shiftKey && e.key === 'C') {
    e.preventDefault()
    copyOutput()
  }
  // Ctrl+Delete 清空
  if (e.ctrlKey && e.key === 'Delete') {
    e.preventDefault()
    clearAll()
  }
}

// 初始化 Monaco Editor
const initMonacoEditor = () => {
  // 检查 Monaco 是否可用
  if (typeof (window as any).monaco !== 'undefined') {
    useMonaco.value = true
    
    // 初始化输入编辑器
    if (inputEditorRef.value) {
      inputEditorInstance = (window as any).monaco.editor.create(inputEditorRef.value, {
        value: inputJson.value,
        language: 'json',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        wordWrap: 'on',
        scrollBeyondLastLine: false,
      })
      
      inputEditorInstance.onDidChangeModelContent(() => {
        inputJson.value = inputEditorInstance.getValue()
        onInputChanged(inputJson.value)
      })
    }
    
    // 初始化输出编辑器
    if (outputEditorRef.value) {
      outputEditorInstance = (window as any).monaco.editor.create(outputEditorRef.value, {
        value: outputJson.value,
        language: 'json',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        wordWrap: 'on',
        readOnly: true,
        scrollBeyondLastLine: false,
      })
    }
  }
}

// 更新编辑器内容
const updateEditor = (editor: any, value: string) => {
  if (editor && editor.setValue) {
    editor.setValue(value)
  }
}

// Tab 切换处理
const onTabChange = () => {
  clearError()
  // 可以在这里添加 Tab 切换时的逻辑
}

// 核心功能函数
const format = () => {
  clearError()
  try {
    const obj = JSON5.parse(inputJson.value)
    outputJson.value = JSON.stringify(obj, null, 2)
    resultInfo.value = { success: true }
    successMsg.value = '✅ JSON 格式化成功'
    updateEditor(outputEditorInstance, outputJson.value)
  } catch (e) {
    errorMsg.value = `❌ 无效 JSON: ${(e as Error).message}`
    resultInfo.value = { success: false }
  }
}

const validate = () => {
  clearError()
  try {
    JSON5.parse(inputJson.value)
    outputJson.value = '✅ JSON 格式正确\n\n详细信息：\n- 语法正确\n- 结构完整'
    resultInfo.value = { success: true }
    successMsg.value = '✅ JSON 校验通过'
    updateEditor(outputEditorInstance, outputJson.value)
  } catch (e) {
    errorMsg.value = `❌ 无效 JSON: ${(e as Error).message}`
    resultInfo.value = { success: false }
  }
}

const compress = () => {
  clearError()
  try {
    const obj = JSON5.parse(inputJson.value)
    outputJson.value = JSON.stringify(obj)
    resultInfo.value = { success: true }
    successMsg.value = '✅ JSON 压缩成功'
    updateEditor(outputEditorInstance, outputJson.value)
  } catch (e) {
    errorMsg.value = `❌ 无效 JSON: ${(e as Error).message}`
    resultInfo.value = { success: false }
  }
}

// 转义功能修复 - 确保对 JSON 解析后的内容进行操作
const escapeStr = () => {
  clearError()
  try {
    // 先尝试解析 JSON，如果成功则对字符串值进行转义
    try {
      const obj = JSON5.parse(inputJson.value)
      // 如果是字符串，直接转义
      if (typeof obj === 'string') {
        outputJson.value = jsonEscape(obj)
      } else {
        // 如果是对象，转换为字符串后转义
        outputJson.value = jsonEscape(JSON.stringify(obj))
      }
    } catch {
      // 如果不是 JSON，直接对输入字符串转义
      outputJson.value = jsonEscape(inputJson.value)
    }
    resultInfo.value = { success: true }
    successMsg.value = '✅ 字符串转义成功'
    updateEditor(outputEditorInstance, outputJson.value)
  } catch (e) {
    errorMsg.value = `转义失败：${(e as Error).message}`
    resultInfo.value = { success: false }
  }
}

const unescapeStr = () => {
  clearError()
  try {
    outputJson.value = jsonUnescape(inputJson.value)
    resultInfo.value = { success: true }
    successMsg.value = '✅ 去除转义成功'
    updateEditor(outputEditorInstance, outputJson.value)
  } catch (e) {
    errorMsg.value = `去转义失败：${(e as Error).message}`
    resultInfo.value = { success: false }
  }
}

const escapeAll = () => {
  clearError()
  try {
    outputJson.value = jsonEscapeAll(inputJson.value)
    resultInfo.value = { success: true }
    successMsg.value = '✅ 全部转义成功'
    updateEditor(outputEditorInstance, outputJson.value)
  } catch (e) {
    errorMsg.value = `全部转义失败：${(e as Error).message}`
    resultInfo.value = { success: false }
  }
}

const unescapeAll = () => {
  clearError()
  try {
    outputJson.value = jsonUnescapeAll(inputJson.value)
    resultInfo.value = { success: true }
    successMsg.value = '✅ 全部去转义成功'
    updateEditor(outputEditorInstance, outputJson.value)
  } catch (e) {
    errorMsg.value = `全部去转义失败：${(e as Error).message}`
    resultInfo.value = { success: false }
  }
}

const queryJsonPath = () => {
  clearError()
  if (!jsonpathQuery.value) {
    errorMsg.value = '请输入 JSONPath 查询表达式'
    resultInfo.value = { success: false }
    return
  }
  
  const result = jsonPathQuery(inputJson.value, jsonpathQuery.value)
  if (result.success) {
    outputJson.value = result.result || '未找到匹配结果'
    resultInfo.value = { success: true, count: result.resultCount }
    successMsg.value = `✅ 查询成功，找到 ${result.resultCount} 个结果`
    updateEditor(outputEditorInstance, outputJson.value)
  } else {
    errorMsg.value = result.error || '查询失败'
    resultInfo.value = { success: false }
  }
}

const convertFormat = () => {
  clearError()
  const source = convertSourceFormat.value
  const target = convertTargetFormat.value
  
  if (source === target) {
    errorMsg.value = '源格式和目标格式相同'
    resultInfo.value = { success: false }
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
        updateEditor(outputEditorInstance, outputJson.value)
      } else {
        errorMsg.value = result.error || '转换失败'
        resultInfo.value = { success: false }
      }
    } else {
      errorMsg.value = '不支持的转换组合'
      resultInfo.value = { success: false }
    }
  } catch (e) {
    errorMsg.value = `转换失败：${(e as Error).message}`
    resultInfo.value = { success: false }
  }
}

const escapeForLanguage = () => {
  clearError()
  const result = jsonEscapeForLanguage(inputJson.value, escapeLanguage.value)
  if (result.success) {
    outputJson.value = result.result || ''
    resultInfo.value = { success: true }
    successMsg.value = `✅ 已为 ${escapeLanguage.value.toUpperCase()} 转义`
    updateEditor(outputEditorInstance, outputJson.value)
  } else {
    errorMsg.value = result.error || '转义失败'
    resultInfo.value = { success: false }
  }
}

const unescapeFromLanguage = () => {
  clearError()
  const result = unescapeFromLanguageCore(inputJson.value, escapeLanguage.value)
  if (result.success) {
    outputJson.value = result.result || ''
    resultInfo.value = { success: true }
    successMsg.value = `✅ 已从 ${escapeLanguage.value.toUpperCase()} 还原`
    updateEditor(outputEditorInstance, outputJson.value)
  } else {
    errorMsg.value = result.error || '还原失败'
    resultInfo.value = { success: false }
  }
}

const compareJson = () => {
  clearError()
  if (!inputJson1.value || !inputJson2.value) {
    errorMsg.value = '请输入两个 JSON 进行比较'
    resultInfo.value = { success: false }
    return
  }
  
  const result = jsonDiffCompare(inputJson1.value, inputJson2.value, diffFormat.value as any)
  if (result.success) {
    outputJson.value = result.result || ''
    resultInfo.value = { success: true, hasChanges: result.hasChanges }
    if (!result.hasChanges) {
      successMsg.value = '✅ 两个 JSON 完全相同'
    } else {
      successMsg.value = '⚠️ 发现差异'
    }
    updateEditor(outputEditorInstance, outputJson.value)
  } else {
    errorMsg.value = result.error || '比较失败'
    resultInfo.value = { success: false }
  }
}

// 复制功能
const copyOutput = async () => {
  if (outputJson.value) {
    try {
      await navigator.clipboard.writeText(outputJson.value)
      successMsg.value = '✅ 已复制到剪贴板'
    } catch {
      errorMsg.value = '复制失败，请手动复制'
    }
  }
}

// 粘贴功能
const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputJson.value = text
    onInputChanged(text)
    if (inputEditorInstance) {
      inputEditorInstance.setValue(text)
    }
    successMsg.value = '✅ 已从剪贴板粘贴'
  } catch {
    errorMsg.value = '粘贴失败，请手动粘贴'
  }
}

// 清空功能（带确认）
const clearAll = () => {
  // 如果有内容，显示确认
  if (inputJson.value || outputJson.value) {
    const confirmed = window.confirm('确定要清空所有内容吗？此操作不可恢复。')
    if (!confirmed) return
  }
  
  inputJson.value = ''
  inputJson1.value = ''
  inputJson2.value = ''
  outputJson.value = ''
  jsonpathQuery.value = ''
  errorMsg.value = ''
  successMsg.value = ''
  resultInfo.value = null
  isValidJson.value = false
  
  if (inputEditorInstance) {
    inputEditorInstance.setValue('')
  }
  if (outputEditorInstance) {
    outputEditorInstance.setValue('')
  }
}

// 生命周期
onMounted(() => {
  // 初始化 Monaco Editor
  initMonacoEditor()
  
  // 绑定快捷键
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  // 解绑快捷键
  window.removeEventListener('keydown', handleKeyDown)
  
  // 销毁编辑器实例
  if (inputEditorInstance) {
    inputEditorInstance.dispose()
  }
  if (outputEditorInstance) {
    outputEditorInstance.dispose()
  }
})
</script>

<style scoped>
.tool-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

@media (min-width: 1200px) {
  .tool-container {
    max-width: 1400px;
  }
}

.tool-header {
  margin-bottom: 20px;
}

.tool-header h2 {
  font-size: 28px;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.tool-description {
  color: var(--text-secondary);
  margin: 0;
  font-size: 14px;
}

.toolbar {
  padding: 12px 16px;
  background: var(--bg-tertiary);
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid var(--border);
}

.tool-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
}

/* 分栏布局 */
.split-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}

@media (max-width: 900px) {
  .split-layout {
    grid-template-columns: 1fr;
  }
}

/* 面板样式 */
.input-panel, .output-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--bg-tertiary);
  border-radius: 6px;
  border: 1px solid var(--border);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
}

.panel-footer {
  padding: 8px 12px;
  background: var(--bg-tertiary);
  border-radius: 6px;
  border: 1px solid var(--border);
}

/* 编辑器包装器 */
.editor-wrapper {
  flex: 1;
  min-height: 300px;
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
}

.monaco-editor {
  width: 100%;
  height: 300px;
}

.fallback-textarea {
  width: 100%;
  height: 100%;
}

.fallback-textarea :deep(.n-input) {
  height: 100%;
}

.fallback-textarea :deep(.n-input__textarea) {
  height: 100%;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
}

/* 示例卡片 */
.examples-card {
  margin-top: 16px;
}

.example-item {
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
}

.example-item:last-child {
  border-bottom: none;
}

small {
  color: var(--text-secondary);
  display: block;
  margin-top: 4px;
  font-size: 12px;
}

/* 差异比较布局 */
.diff-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}

.diff-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.diff-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: var(--bg-tertiary);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.diff-output {
  grid-column: 1 / -1;
}

@media (max-width: 1200px) {
  .diff-inputs {
    grid-template-columns: 1fr;
  }
  
  .diff-layout {
    grid-template-columns: 1fr;
  }
  
  .diff-actions {
    order: -1;
  }
}

/* 快捷键提示 */
:deep(.n-button__content) {
  display: flex;
  align-items: center;
  gap: 6px;
}

:deep(.n-button__content kbd) {
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-family: monospace;
  border: 1px solid var(--border);
}

/* 警报样式优化 */
:deep(.n-alert) {
  margin-top: 16px;
  border-radius: 8px;
}

/* 模态框优化 */
:deep(.n-modal) {
  border-radius: 12px;
}

:deep(.n-list-item) {
  padding: 12px;
}

/* 标签图标 */
:deep(.n-tag__icon) {
  display: flex;
  align-items: center;
  margin-right: 4px;
}

/* 代码高亮 */
:deep(.n-code) {
  background: var(--bg-tertiary);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

/* 空状态 */
:deep(.n-empty) {
  padding: 20px;
}
</style>
