<template>
  <n-config-provider :theme="darkTheme">
    <n-message-provider>
      <div class="app-container">
        <!-- 侧边栏 -->
        <aside class="sidebar">
          <div class="logo">
            <h1>JTool</h1>
            <span class="version">v0.1.0</span>
          </div>
          
          <n-menu
            v-model:value="activeTool"
            :options="menuOptions"
            @update:value="handleToolChange"
          />
          
          <div class="sidebar-footer">
            <n-button quaternary icon="⚙️">设置</n-button>
          </div>
        </aside>
        
        <!-- 主内容区 -->
        <main class="main-content">
          <component :is="currentToolComponent" />
        </main>
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

const activeTool = ref('hash')

const menuOptions = [
  { label: '📐 哈希计算', key: 'hash' },
  { label: '🔐 BASE64', key: 'base64' },
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
  width: 100vw;
  height: 100vh;
}

.sidebar {
  width: 200px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid var(--border);
}

.logo h1 {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
}

.version {
  font-size: 12px;
  color: var(--text-secondary);
}

.sidebar-footer {
  margin-top: auto;
  padding: 10px;
  border-top: 1px solid var(--border);
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: var(--bg-primary);
}
</style>
