<template>
  <div class="tool-container">
    <h2>🔍 正则表达式测试</h2>
    <p class="tool-description">在线测试正则表达式匹配、查找、替换，支持高亮显示</p>
    
    <n-card class="tool-card">
      <n-space vertical>
        <!-- 正则输入 -->
        <n-input-group>
          <n-input 
            v-model:value="pattern" 
            placeholder="正则表达式，如：\d+" 
            @input="debouncedTest"
          />
          <n-input 
            v-model:value="flags" 
            placeholder="标志：gim" 
            style="width: 100px"
            @input="debouncedTest"
          />
        </n-input-group>
        
        <!-- 实时匹配开关 -->
        <n-space>
          <n-switch v-model:value="realtime" size="small">
            <template #checked>实时匹配</template>
            <template #unchecked>手动测试</template>
          </n-switch>
          <n-button type="primary" @click="testRegex" v-if="!realtime">测试</n-button>
          <n-button @click="replace" v-if="!realtime">替换</n-button>
        </n-space>
        
        <!-- 测试文本 -->
        <n-input
          v-model:value="testString"
          type="textarea"
          placeholder="输入测试文本..."
          :rows="6"
          @input="onTestStringInput"
        />
        
        <!-- 替换输入 -->
        <n-input 
          v-model:value="replacement" 
          placeholder="替换内容（可选），支持 $1, $2 等反向引用" 
        />
        
        <!-- 匹配统计 -->
        <n-alert v-if="result && result.valid" type="info" style="margin-top: 12px">
          找到 {{ result.matches.length }} 个匹配，耗时 {{ result.duration }}ms
        </n-alert>
        
        <!-- 匹配结果 -->
        <n-divider>匹配结果</n-divider>
        
        <div v-if="result" class="result-section">
          <n-alert :type="result.valid ? 'success' : 'error'">
            {{ result.valid ? '✅ 正则表达式有效' : '❌ ' + result.error }}
          </n-alert>
          
          <!-- 高亮显示 -->
          <div v-if="result.valid && result.matches.length > 0" class="highlight-section">
            <h4>📍 原文本高亮:</h4>
            <div class="highlighted-text" v-html="result.highlighted"></div>
          </div>
          
          <!-- 匹配详情 -->
          <div v-if="result.valid && result.matches.length > 0" class="matches-detail">
            <h4>📋 匹配详情:</h4>
            <n-collapse>
              <n-collapse-item 
                v-for="(match, i) in result.matches" 
                :key="i"
                :title="`匹配 ${i + 1}: ${match.match}`"
                :name="i"
              >
                <n-space vertical>
                  <div><strong>位置:</strong> {{ match.index }} - {{ match.index + match.match.length }}</div>
                  <div v-if="match.groups && Object.keys(match.groups).length > 0">
                    <strong>捕获组:</strong>
                    <n-code v-for="(group, key) in match.groups" :key="key">
                      {{ key }}: {{ group }}
                    </n-code>
                  </div>
                </n-space>
              </n-collapse-item>
            </n-collapse>
          </div>
          
          <div v-if="result.valid && result.matches.length === 0" class="no-match">
            未找到匹配
          </div>
        </div>
        
        <!-- 替换结果 -->
        <div v-if="replaceResult" class="replace-result">
          <n-divider>替换结果</n-divider>
          <n-input 
            v-model:value="replaceResult" 
            readonly 
            type="textarea" 
            :rows="4" 
          />
        </div>
      </n-space>
    </n-card>
    
    <!-- 常用正则模板 -->
    <n-card class="tool-card" style="margin-top: 16px">
      <h3>📚 常用正则表达式模板</h3>
      <n-space vertical>
        <div v-for="(item, name) in commonPatterns" :key="name" class="pattern-item">
          <n-space>
            <n-tag 
              @click="usePattern(name)" 
              style="cursor: pointer"
              :bordered="false"
            >
              {{ item.name }}
            </n-tag>
            <span class="pattern-desc">{{ item.desc }}</span>
          </n-space>
        </div>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { NCard, NSpace, NInput, NInputGroup, NButton, NDivider, NAlert, NTag, NSwitch, NCollapse, NCollapseItem, NCode } from 'naive-ui'
import { testRegex as testRegexFn, regexReplace, COMMON_REGEX_PATTERNS, getCommonRegexDesc } from '@jtool/core'

const pattern = ref('')
const flags = ref('g')
const testString = ref('')
const replacement = ref('')
const realtime = ref(true)
const result = ref<any>(null)
const replaceResult = ref('')

const commonPatterns = {
  email: { name: '📧 邮箱', desc: getCommonRegexDesc('email') },
  phone: { name: '📱 手机号', desc: getCommonRegexDesc('phone') },
  url: { name: '🔗 URL', desc: getCommonRegexDesc('url') },
  ip: { name: '🌐 IP 地址', desc: getCommonRegexDesc('ip') },
  idCard: { name: '🆔 身份证号', desc: getCommonRegexDesc('idCard') },
  qq: { name: '💬 QQ 号', desc: getCommonRegexDesc('qq') },
  postalCode: { name: '📮 邮政编码', desc: getCommonRegexDesc('postalCode') },
  username: { name: '👤 用户名', desc: getCommonRegexDesc('username') },
  password: { name: '🔐 密码强度', desc: getCommonRegexDesc('password') },
  chinese: { name: '🀄 中文', desc: getCommonRegexDesc('chinese') },
  number: { name: '🔢 数字', desc: '匹配数字' },
  whitespace: { name: '␣ 空白字符', desc: '匹配空白字符' },
  word: { name: '📝 单词', desc: '匹配单词字符' },
}

let debounceTimer: any = null

const debouncedTest = () => {
  if (!realtime.value) return
  
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  debounceTimer = setTimeout(() => {
    testRegex()
  }, 300)
}

const onTestStringInput = () => {
  if (realtime.value && pattern.value) {
    debouncedTest()
  }
}

const testRegex = () => {
  const startTime = performance.now()
  const res = testRegexFn(pattern.value, testString.value, flags.value)
  const duration = (performance.now() - startTime).toFixed(2)
  
  if (res.valid) {
    // 添加高亮显示
    res.highlighted = highlightMatches(testString.value, res.matches)
  }
  
  res.duration = duration
  result.value = res
  replaceResult.value = ''
}

const highlightMatches = (text: string, matches: any[]) => {
  if (!matches || matches.length === 0) return escapeHtml(text)
  
  // 按位置排序
  const sorted = [...matches].sort((a, b) => a.index - b.index)
  
  let result = ''
  let lastIndex = 0
  
  for (const match of sorted) {
    // 添加未匹配的部分
    result += escapeHtml(text.slice(lastIndex, match.index))
    // 添加高亮的匹配部分
    result += `<mark class="match-highlight">${escapeHtml(match.match)}</mark>`
    lastIndex = match.index + match.match.length
  }
  
  // 添加剩余部分
  result += escapeHtml(text.slice(lastIndex))
  
  return result
}

const escapeHtml = (text: string) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
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
  if (realtime.value) {
    debouncedTest()
  }
}

// 监听实时开关
watch(realtime, (newVal) => {
  if (newVal && pattern.value && testString.value) {
    testRegex()
  }
})
</script>

<style scoped>
.tool-container { max-width: 100%; margin: 0 auto; }
@media (min-width: 1200px) { .tool-container { max-width: 1200px; } }
@media (min-width: 1600px) { .tool-container { max-width: 1600px; } }
h2 { font-size: 24px; margin-bottom: 8px; }
.tool-description { color: var(--text-secondary); margin-bottom: 20px; }
.tool-card { background: var(--bg-secondary); border: 1px solid var(--border); }
.result-section { margin-top: 12px; }
.highlight-section { margin-top: 12px; }
.highlighted-text {
  background: var(--bg-primary);
  padding: 12px;
  border-radius: 4px;
  font-family: 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}
.match-highlight {
  background: rgba(255, 215, 0, 0.4);
  border-bottom: 2px solid #ffd700;
  padding: 2px 4px;
  border-radius: 2px;
}
.matches-detail { margin-top: 12px; }
.no-match { color: var(--text-secondary); margin-top: 12px; }
.pattern-item { display: flex; align-items: center; gap: 8px; margin: 4px 0; }
.pattern-desc { font-size: 13px; color: var(--text-secondary); }
h4 { font-size: 14px; margin: 12px 0 8px; color: var(--text-secondary); }
</style>
