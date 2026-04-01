<template>
  <div class="tool-container">
    <h2>🕐 时间戳转换</h2>
    <p class="tool-description">时间戳与日期互相转换，支持时区</p>
    
    <n-card class="tool-card">
      <n-space vertical>
        <n-input-group>
          <n-input v-model:value="timestamp" placeholder="时间戳" @input="tsToDate" />
          <n-button @click="now">现在</n-button>
        </n-input-group>
        
        <n-input-group>
          <n-input v-model:value="dateStr" placeholder="日期时间" @input="dateToTs" />
          <n-button @click="setNow">当前时间</n-button>
        </n-input-group>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { NCard, NInput, NButton, NInputGroup, NSpace } from 'naive-ui'

const timestamp = ref('')
const dateStr = ref('')

const tsToDate = () => {
  const ts = parseInt(timestamp.value)
  if (ts) {
    dateStr.value = dayjs(ts).format('YYYY-MM-DD HH:mm:ss')
  }
}

const dateToTs = () => {
  const d = dayjs(dateStr.value)
  if (d.isValid()) {
    timestamp.value = d.valueOf().toString()
  }
}

const now = () => {
  const ts = Date.now().toString()
  timestamp.value = ts
  dateStr.value = dayjs(ts).format('YYYY-MM-DD HH:mm:ss')
}

const setNow = () => {
  const d = dayjs()
  dateStr.value = d.format('YYYY-MM-DD HH:mm:ss')
  timestamp.value = d.valueOf().toString()
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
