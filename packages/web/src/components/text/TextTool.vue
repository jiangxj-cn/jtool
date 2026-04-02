<template>
  <div class="tool-container">
    <h2>📄 文本处理</h2>
    <p class="tool-description">大小写转换、去重、排序、字符统计等</p>
    
    <n-card class="tool-card">
      <n-space vertical>
        <n-input
          v-model:value="inputText"
          type="textarea"
          placeholder="输入文本..."
          :rows="5"
          @input="updateStats"
        />
        
        <n-space>
          <n-button @click="toUpperCase">大写</n-button>
          <n-button @click="toLowerCase">小写</n-button>
          <n-button @click="removeDuplicates">行去重</n-button>
          <n-button @click="sortLines">行排序</n-button>
          <n-button @click="clear">清空</n-button>
        </n-space>
        
        <n-statistic label="字符数">
          {{ stats.characters }}
        </n-statistic>
        <n-space>
          <n-statistic label="行数">
            {{ stats.lines }}
          </n-statistic>
          <n-statistic label="单词数">
            {{ stats.words }}
          </n-statistic>
        </n-space>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { NCard, NInput, NButton, NSpace, NStatistic } from 'naive-ui'

const inputText = ref('')

const stats = reactive({
  characters: 0,
  lines: 0,
  words: 0,
})

const updateStats = () => {
  stats.characters = inputText.value.length
  stats.lines = inputText.value ? inputText.value.split('\n').length : 0
  stats.words = inputText.value.trim() ? inputText.value.trim().split(/\s+/).length : 0
}

const toUpperCase = () => {
  inputText.value = inputText.value.toUpperCase()
  updateStats()
}

const toLowerCase = () => {
  inputText.value = inputText.value.toLowerCase()
  updateStats()
}

const removeDuplicates = () => {
  const lines = inputText.value.split('\n')
  const unique = [...new Set(lines)]
  inputText.value = unique.join('\n')
  updateStats()
}

const sortLines = () => {
  const lines = inputText.value.split('\n')
  lines.sort()
  inputText.value = lines.join('\n')
  updateStats()
}

const clear = () => {
  inputText.value = ''
  updateStats()
}
</script>

<style scoped>
.tool-container { max-width: 100%; margin: 0 auto; }
@media (min-width: 1200px) { .tool-container { max-width: 1200px; } }
@media (min-width: 1600px) { .tool-container { max-width: 1600px; } }
h2 { font-size: 24px; margin-bottom: 8px; }
.tool-description { color: var(--text-secondary); margin-bottom: 20px; }
.tool-card { background: var(--bg-secondary); border: 1px solid var(--border); }
</style>
