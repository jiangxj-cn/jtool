<template>
  <n-config-provider :theme="darkTheme">
    <n-message-provider>
      <div class="app-container">
        <!-- 标题栏（支持拖拽和窗口控制） -->
        <header class="titlebar" data-tauri-drag-region>
          <div class="titlebar-title">JTool - 开发者工具集</div>
          <div class="titlebar-controls">
            <n-button quaternary circle size="small" @click="minimize">
              <span>─</span>
            </n-button>
            <n-button quaternary circle size="small" @click="toggleMaximize">
              <span>{{ isMaximized ? '❐' : '□' }}</span>
            </n-button>
            <n-button quaternary circle size="small" @click="close">
              <span>✕</span>
            </n-button>
          </div>
        </header>
        
        <!-- 主内容区 -->
        <div class="main-wrapper">
          <!-- 侧边栏 -->
          <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
            <div class="logo">
              <h1 v-if="!sidebarCollapsed">JTool</h1>
              <h1 v-else>🛠️</h1>
              <span v-if="!sidebarCollapsed" class="version">v0.2.0</span>
            </div>
            
            <n-menu
              v-model:value="activeTool"
              :options="menuOptions"
              @update:value="handleToolChange"
              :collapsed="sidebarCollapsed"
              :collapsed-width="64"
              :collapsed-icon-size="24"
            />
            
            <div class="sidebar-footer">
              <n-button quaternary circle @click="toggleSidebar">
                {{ sidebarCollapsed ? '→' : '←' }}
              </n-button>
            </div>
          </aside>
          
          <!-- 主内容区 -->
          <main class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
            <component :is="currentToolComponent" />
          </main>
        </div>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { darkTheme, NConfigProvider, NMessageProvider, NMenu, NButton } from 'naive-ui'
import HashTool from './components/hash/HashTool.vue'
import Base64Tool from './components/base64/Base64Tool.vue'
import TimestampTool from './components/timestamp/TimestampTool.vue'
import JsonTool from './components/json/JsonTool.vue'
import QrcodeTool from './components/qrcode/QrcodeTool.vue'
import UrlTool from './components/url/UrlTool.vue'
import TextTool from './components/text/TextTool.vue'
import BaseConverterTool from './components/base-converter/BaseConverterTool.vue'
import RegexTool from './components/regex/RegexTool.vue'
import JWTTool from './components/jwt/JWTTool.vue'
import AsciiTool from './components/ascii/AsciiTool.vue'

const activeTool = ref('hash')
const isMaximized = ref(false)
const sidebarCollapsed = ref(false)

// 窗口控制（Tauri API）
const minimize = () => {
  // @ts-ignore - Tauri API
  if (window.__TAURI__) {
    // @ts-ignore
    window.__TAURI__.appWindow.minimize()
  }
}

const toggleMaximize = () => {
  // @ts-ignore
  if (window.__TAURI__) {
    // @ts-ignore
    window.__TAURI__.appWindow.toggleMaximize()
    isMaximized.value = !isMaximized.value
  }
}

const close = () => {
  // @ts-ignore
  if (window.__TAURI__) {
    // @ts-ignore
    window.__TAURI__.appWindow.close()
  }
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const menuOptions = [
  { label: '📐 哈希计算', key: 'hash' },
  { label: '🔐 BASE64', key: 'base64' },
  { label: '🔤 ASCII 转换', key: 'ascii' },
  { label: '🕐 时间戳转换', key: 'timestamp' },
  { label: '📝 JSON 工具', key: 'json' },
  { label: '📱 二维码', key: 'qrcode' },
  { label: '🔗 URL 编码', key: 'url' },
  { label: '📄 文本处理', key: 'text' },
  { label: '🔢 进制转换', key: 'baseConverter' },
  { label: '🔍 正则测试', key: 'regex' },
  { label: '🔑 JWT 解码', key: 'jwt' },
]

const toolComponents: Record<string, any> = {
  hash: HashTool,
  base64: Base64Tool,
  ascii: AsciiTool,
  timestamp: TimestampTool,
  json: JsonTool,
  qrcode: QrcodeTool,
  url: UrlTool,
  text: TextTool,
  baseConverter: BaseConverterTool,
  regex: RegexTool,
  jwt: JWTTool,
}

const currentToolComponent = computed(() => toolComponents[activeTool.value])

const handleToolChange = (key: string) => {
  activeTool.value = key
}
</script>

<style>
:root {
  --bg-primary: #1a1a1a;
  --bg-secondary: #242424;
  --bg-tertiary: #2a2a2a;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --accent: #409eff;
  --border: #333333;
  --titlebar-height: 32px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
}

.app-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}

/* 标题栏 */
.titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--titlebar-height);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  user-select: none;
}

.titlebar-title {
  flex: 1;
  padding-left: 12px;
  font-size: 13px;
  font-weight: 500;
}

.titlebar-controls {
  display: flex;
  gap: 4px;
  padding-right: 8px;
}

.titlebar-controls .n-button {
  width: 28px;
  height: 28px;
}

/* 主内容区 */
.main-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 64px;
}

.logo {
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid var(--border);
}

.logo h1 {
  font-size: 20px;
  margin-bottom: 4px;
  transition: font-size 0.3s ease;
}

.sidebar.collapsed .logo h1 {
  font-size: 24px;
}

.version {
  font-size: 12px;
  color: var(--text-secondary);
  transition: opacity 0.3s ease;
}

.sidebar.collapsed .version {
  opacity: 0;
  display: none;
}

.sidebar-footer {
  margin-top: auto;
  padding: 10px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: center;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  transition: all 0.3s ease;
}

.main-content.sidebar-collapsed {
  padding: 20px;
}

/* 工具容器响应式宽度 */
.tool-container {
  max-width: 100%;
  margin: 0 auto;
  transition: max-width 0.3s ease;
}

@media (min-width: 1200px) {
  .tool-container {
    max-width: 1200px;
  }
}

@media (min-width: 1600px) {
  .tool-container {
    max-width: 1600px;
  }
}

@media (min-width: 2000px) {
  .tool-container {
    max-width: 2000px;
  }
}

/* 响应式布局 */
@media (max-width: 1024px) {
  .sidebar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
  }
  
  .sidebar.collapsed {
    transform: translateX(-100%);
  }
}
</style>

// 设置相关
const showSettings = ref(false)

// 导入设置组件
import Settings from './components/Settings.vue'
