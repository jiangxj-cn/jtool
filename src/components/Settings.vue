<template>
  <div class="settings-container">
    <h2>⚙️ 设置</h2>
    
    <n-card class="settings-card">
      <n-space vertical>
        <div class="setting-item">
          <div class="setting-label">
            <n-icon :component="AppsOutline" />
            <span>关闭行为</span>
          </div>
          <n-radio-group v-model:value="closeBehavior">
            <n-space>
              <n-radio value="hide">最小化到托盘</n-radio>
              <n-radio value="exit">直接退出</n-radio>
            </n-space>
          </n-radio-group>
          <p class="setting-desc">
            选择点击关闭按钮时的行为
          </p>
        </div>

        <div class="setting-item">
          <div class="setting-label">
            <n-icon :component="FlashOutline" />
            <span>开机自启</span>
          </div>
          <n-switch v-model:value="autoStart" />
          <p class="setting-desc">
            系统启动时自动运行 JTool
          </p>
        </div>

        <div class="setting-item">
          <div class="setting-label">
            <n-icon :component="MoonOutline" />
            <span>主题</span>
          </div>
          <n-select
            v-model:value="theme"
            :options="themeOptions"
            style="width: 200px"
          />
          <p class="setting-desc">
            选择应用主题
          </p>
        </div>

        <div class="setting-actions">
          <n-button type="primary" @click="saveSettings">保存设置</n-button>
          <n-button @click="resetSettings">恢复默认</n-button>
        </div>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NSpace, NIcon, NRadioGroup, NRadio, NSwitch, NSelect, NButton } from 'naive-ui'
import { AppsOutline, FlashOutline, MoonOutline } from '@vicons/ionicons5'

const closeBehavior = ref('hide')
const autoStart = ref(false)
const theme = ref('dark')

const themeOptions = [
  { label: '深色', value: 'dark' },
  { label: '浅色', value: 'light' },
  { label: '自动', value: 'auto' },
]

const saveSettings = () => {
  // 保存到 localStorage
  localStorage.setItem('jtool-settings', JSON.stringify({
    closeBehavior: closeBehavior.value,
    autoStart: autoStart.value,
    theme: theme.value,
  }))
  window.$message.success('设置已保存')
}

const resetSettings = () => {
  closeBehavior.value = 'hide'
  autoStart.value = false
  theme.value = 'dark'
  localStorage.removeItem('jtool-settings')
  window.$message.success('已恢复默认设置')
}

// 加载设置
const loadSettings = () => {
  const saved = localStorage.getItem('jtool-settings')
  if (saved) {
    const settings = JSON.parse(saved)
    closeBehavior.value = settings.closeBehavior || 'hide'
    autoStart.value = settings.autoStart || false
    theme.value = settings.theme || 'dark'
  }
}

loadSettings()
</script>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.settings-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
}

.setting-item {
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  margin-bottom: 12px;
}

.setting-desc {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 13px;
}

.setting-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}
</style>
