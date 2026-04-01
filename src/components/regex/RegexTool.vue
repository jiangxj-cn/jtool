<template>
  <div class="tool-container">
    <h2>🔍 正则表达式测试</h2>
    <p class="tool-description">在线测试正则表达式匹配、查找、替换</p>
    
    <n-card class="tool-card">
      <n-space vertical>
        <n-input-group>
          <n-input v-model:value="pattern" placeholder="正则表达式，如：\d+" />
          <n-input v-model:value="flags" placeholder="标志：gim" style="width: 100px" />
        </n-input-group>
        
        <n-input
          v-model:value="testString"
          type="textarea"
          placeholder="输入测试文本..."
          :rows="4"
        />
        
        <n-space>
          <n-button type="primary" @click="testRegex">测试</n-button>
          <n-button @click="replace">替换</n-button>
        </n-space>
        
        <n-input v-model:value="replacement" placeholder="替换内容（可选）" />
        
        <n-divider>匹配结果</n-divider>
        
        <div v-if="result" class="result-section">
          <n-alert :type="result.valid ? 'success' : 'error'">
            {{ result.valid ? '✅ 正则表达式有效' : '❌ ' + result.error }}
          </n-alert>
          
          <div v-if="result.valid && result.matches.length > 0" class="matches">
            <n-tag v-for="(match, i) in result.matches" :key="i" :bordered="false" style="margin: 4px">
              {{ match.match }} (位置：{{ match.index }})
            </n-tag>
          </div>
          
          <div v-if="result.valid && result.matches.length === 0" class="no-match">
            未找到匹配
          </div>
        </div>
        
        <div v-if="replaceResult" class="replace-result">
          <n-divider>替换结果</n-divider>
          <n-input v-model:value="replaceResult" readonly type="textarea" :rows="3" />
        </div>
      </n-space>
    </n-card>
    
    <n-card class="tool-card" style="margin-top: 16px">
      <h3>常用正则表达式</h3>
      <n-space vertical>
        <div v-for="(desc, name) in commonPatterns" :key="name" class="pattern-item">
          <n-tag @click="usePattern(name)" style="cursor: pointer">{{ name }}</n-tag>
          <span class="pattern-desc">{{ desc }}</span>
        </div>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NSpace, NInput, NInputGroup, NButton, NDivider, NAlert, NTag } from 'naive-ui'
import { testRegex as testRegexFn, regexReplace, COMMON_REGEX_PATTERNS, getCommonRegexDesc } from '@jtool/core'

const pattern = ref('')
const flags = ref('g')
const testString = ref('')
const replacement = ref('')
const result = ref<any>(null)
const replaceResult = ref('')

const commonPatterns = {
  email: getCommonRegexDesc('email'),
  phone: getCommonRegexDesc('phone'),
  url: getCommonRegexDesc('url'),
  ip: getCommonRegexDesc('ip'),
  idCard: getCommonRegexDesc('idCard'),
  qq: getCommonRegexDesc('qq'),
  postalCode: getCommonRegexDesc('postalCode'),
  username: getCommonRegexDesc('username'),
  password: getCommonRegexDesc('password'),
  chinese: getCommonRegexDesc('chinese'),
}

const testRegex = () => {
  result.value = testRegexFn(pattern.value, testString.value, flags.value)
  replaceResult.value = ''
}

const replace = () => {
  const res = regexReplace(pattern.value, testString.value, replacement.value, flags.value)
  if (res.success) {
    replaceResult.value = res.result || ''
  } else {
    replaceResult.value = '错误：' + res.error
  }
}

const usePattern = (name: string) => {
  const patternMap: Record<string, RegExp> = COMMON_REGEX_PATTERNS as any
  pattern.value = patternMap[name]?.source || ''
}
</script>

<style scoped>
.tool-container { max-width: 900px; }
h2 { font-size: 24px; margin-bottom: 8px; }
.tool-description { color: var(--text-secondary); margin-bottom: 20px; }
.tool-card { background: var(--bg-secondary); border: 1px solid var(--border); }
.result-section { margin-top: 12px; }
.matches { margin-top: 12px; }
.no-match { color: var(--text-secondary); margin-top: 12px; }
.pattern-item { display: flex; align-items: center; gap: 8px; margin: 4px 0; }
.pattern-desc { font-size: 12px; color: var(--text-secondary); }
</style>
