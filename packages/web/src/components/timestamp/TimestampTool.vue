<template>
  <div class="tool-container">
    <h2>🕐 时间戳转换</h2>
    <p class="tool-description">时间戳与日期互相转换，支持毫秒/秒单位和多时区</p>
    
    <n-card class="tool-card">
      <n-space vertical>
        <!-- 单位切换 -->
        <n-space>
          <n-radio-group v-model:value="unit">
            <n-radio-button value="ms">毫秒 (ms)</n-radio-button>
            <n-radio-button value="s">秒 (s)</n-radio-button>
          </n-radio-group>
        </n-space>
        
        <!-- 时区选择 -->
        <n-space>
          <n-select
            v-model:value="selectedTimezone"
            :options="timezoneOptions"
            style="width: 200px"
            @update:value="syncDisplay"
          />
        </n-space>
        
        <!-- 时间戳输入 -->
        <n-input-group>
          <n-input 
            v-model:value="timestamp" 
            placeholder="时间戳" 
            @input="tsToDate" 
          />
          <n-button @click="now">现在</n-button>
        </n-input-group>
        
        <!-- 日期时间输入 -->
        <n-input-group>
          <n-input 
            v-model:value="dateStr" 
            placeholder="日期时间" 
            @input="dateToTs" 
          />
          <n-button @click="setNow">当前时间</n-button>
        </n-input-group>
        
        <!-- 快捷时间 -->
        <n-divider style="margin: 12px 0">快捷选择</n-divider>
        <n-space wrap>
          <n-button size="small" @click="quickTime(1, 'hour')">1 小时前</n-button>
          <n-button size="small" @click="quickTime(1, 'day')">1 天前</n-button>
          <n-button size="small" @click="quickTime(1, 'week')">1 周前</n-button>
          <n-button size="small" @click="quickTime(1, 'month')">1 月前</n-button>
          <n-button size="small" @click="quickTime(1, 'year')">1 年前</n-button>
        </n-space>
        
        <!-- 多格式显示 -->
        <n-divider style="margin: 12px 0">多种格式</n-divider>
        <n-space vertical>
          <div class="format-row">
            <span class="format-label">ISO 8601:</span>
            <n-input v-model:value="formats.iso" readonly />
          </div>
          <div class="format-row">
            <span class="format-label">Unix 时间戳:</span>
            <n-input v-model:value="formats.unix" readonly />
          </div>
          <div class="format-row">
            <span class="format-label">人类可读:</span>
            <n-input v-model:value="formats.human" readonly />
          </div>
          <div class="format-row">
            <span class="format-label">UTC:</span>
            <n-input v-model:value="formats.utc" readonly />
          </div>
        </n-space>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezonePlugin from 'dayjs/plugin/timezone'
import { NCard, NInput, NButton, NInputGroup, NSpace, NDivider, NSelect, NRadioGroup, NRadioButton } from 'naive-ui'

dayjs.extend(utc)
dayjs.extend(timezonePlugin)

const timestamp = ref('')
const dateStr = ref('')
const unit = ref<'ms' | 's'>('ms')
const selectedTimezone = ref('Asia/Shanghai')

const timezoneOptions = [
  { label: '🌏 北京时间 (CST)', value: 'Asia/Shanghai' },
  { label: '🌏 东京时间 (JST)', value: 'Asia/Tokyo' },
  { label: '🌏 香港时间 (HKT)', value: 'Asia/Hong_Kong' },
  { label: '🌍 UTC', value: 'UTC' },
  { label: '🌍 伦敦时间 (GMT)', value: 'Europe/London' },
  { label: '🌍 巴黎时间 (CET)', value: 'Europe/Paris' },
  { label: '🌎 纽约时间 (EST)', value: 'America/New_York' },
  { label: '🌎 洛杉矶时间 (PST)', value: 'America/Los_Angeles' },
  { label: '🌎 芝加哥时间 (CST)', value: 'America/Chicago' },
]

const formats = ref({
  iso: '',
  unix: '',
  human: '',
  utc: '',
})

const currentDayjs = computed(() => {
  const ts = timestamp.value ? parseInt(timestamp.value) : dayjs().valueOf()
  return unit.value === 's' ? dayjs(ts * 1000) : dayjs(ts)
})

const tsToDate = () => {
  let ts = parseInt(timestamp.value)
  if (!ts) return
  
  if (unit.value === 's') {
    ts = ts * 1000
  }
  
  const d = dayjs(ts).tz(selectedTimezone.value)
  dateStr.value = d.format('YYYY-MM-DD HH:mm:ss')
  updateFormats(d)
}

const dateToTs = () => {
  const d = dayjs.tz(dateStr.value, selectedTimezone.value)
  if (d.isValid()) {
    const ts = unit.value === 's' ? Math.floor(d.valueOf() / 1000) : d.valueOf()
    timestamp.value = ts.toString()
    updateFormats(d)
  }
}

const now = () => {
  const d = dayjs().tz(selectedTimezone.value)
  const ts = unit.value === 's' ? Math.floor(d.valueOf() / 1000) : d.valueOf()
  timestamp.value = ts.toString()
  dateStr.value = d.format('YYYY-MM-DD HH:mm:ss')
  updateFormats(d)
}

const setNow = () => {
  const d = dayjs().tz(selectedTimezone.value)
  dateStr.value = d.format('YYYY-MM-DD HH:mm:ss')
  const ts = unit.value === 's' ? Math.floor(d.valueOf() / 1000) : d.valueOf()
  timestamp.value = ts.toString()
  updateFormats(d)
}

const quickTime = (value: number, unitType: string) => {
  const d = dayjs().subtract(value, unitType as any).tz(selectedTimezone.value)
  const ts = unit.value === 's' ? Math.floor(d.valueOf() / 1000) : d.valueOf()
  timestamp.value = ts.toString()
  dateStr.value = d.format('YYYY-MM-DD HH:mm:ss')
  updateFormats(d)
}

const updateFormats = (d: dayjs.Dayjs) => {
  formats.value = {
    iso: d.toISOString(),
    unix: d.valueOf().toString(),
    human: d.format('YYYY 年 MM 月 DD 日 HH 点 mm 分 ss 秒'),
    utc: d.utc().format('YYYY-MM-DD HH:mm:ss [UTC]'),
  }
}

const syncDisplay = () => {
  if (timestamp.value) {
    tsToDate()
  } else if (dateStr.value) {
    dateToTs()
  }
}

// 监听单位变化，自动转换
watch(unit, () => {
  if (timestamp.value) {
    const ts = parseInt(timestamp.value)
    if (ts) {
      if (unit.value === 's' && ts > 1e12) {
        // 从毫秒切换到秒
        timestamp.value = Math.floor(ts / 1000).toString()
      } else if (unit.value === 'ms' && ts < 1e12) {
        // 从秒切换到毫秒
        timestamp.value = (ts * 1000).toString()
      }
      tsToDate()
    }
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
.format-row { display: flex; align-items: center; gap: 12px; margin: 8px 0; }
.format-label { min-width: 100px; color: var(--text-secondary); font-size: 14px; }
.format-row :deep(.n-input) { flex: 1; }
</style>
