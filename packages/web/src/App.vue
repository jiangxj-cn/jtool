<template>
  <n-config-provider :theme="darkTheme">
    <n-message-provider>
      <div class="app-container">
        <!-- 移动端顶部导航 -->
        <header class="mobile-header">
          <h1>JTool</h1>
          <n-button quaternary @click="toggleMenu">
            <span v-if="!showMenu">☰</span>
            <span v-else>✕</span>
          </n-button>
        </header>

        <!-- 侧边栏 -->
        <aside class="sidebar" :class="{ open: showMenu }">
          <div class="logo">
            <h1>🛠️ JTool</h1>
            <span class="version">v0.2.0</span>
          </div>

          <n-menu
            v-model:value="activeTool"
            :options="menuOptions"
            @update:value="handleToolChange"
          />

          <div class="sidebar-footer">
            <n-button quaternary size="small" @click="toggleTheme">
              {{ isDark ? '☀️ 浅色' : '🌙 深色' }}
            </n-button>
          </div>
        </aside>

        <!-- 主内容区 -->
        <main class="main-content">
          <router-view v-slot="{ Component, route }">
            <transition name="fade" mode="out-in">
              <component :is="Component" :key="route.fullPath" v-if="Component" />
              <ToolSkeleton v-else />
            </transition>
          </router-view>
        </main>

        <!-- 移动端遮罩 -->
        <div v-if="showMenu" class="overlay" @click="toggleMenu"></div>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { darkTheme, NConfigProvider, NMessageProvider, NMenu, NButton } from 'naive-ui'
import ToolSkeleton from './components/common/ToolSkeleton.vue'

const router = useRouter()
const route = useRoute()

const activeTool = ref('home')
const showMenu = ref(false)
const isDark = ref(true)

const menuOptions = [
  { label: '🏠 首页', key: 'home' },
  { label: '📝 JSON', key: 'json' },
  { label: '🔐 BASE64', key: 'base64' },
  { label: '🔗 URL', key: 'url' },
  { label: '📐 哈希计算', key: 'hash' },
  { label: '🕐 时间戳', key: 'timestamp' },
  { label: '📱 二维码', key: 'qrcode' },
  { label: '📄 文本', key: 'text' },
  { label: '🔍 正则测试', key: 'regex' },
  { label: '🔑 JWT', key: 'jwt' },
  { label: '🌐 IP 计算器', key: 'ipcalculator' },
  { label: '🔢 ASCII', key: 'ascii' },
  { label: '🔖 UUID', key: 'uuid' },
  { label: '🎲 随机字符', key: 'random' },
  { label: '🔄 单位换算', key: 'unitconverter' },
]

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const toggleTheme = () => {
  isDark.value = !isDark.value
}

const handleToolChange = (key: string) => {
  activeTool.value = key
  if (key === 'home') {
    router.push('/')
  } else {
    router.push(`/${key}`)
  }
  if (window.innerWidth < 768) {
    showMenu.value = false
  }
}

// 监听路由变化，同步菜单选中状态
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/') {
      activeTool.value = 'home'
    } else {
      const path = newPath.substring(1)
      if (menuOptions.some(opt => opt.key === path)) {
        activeTool.value = path
      }
    }
  },
  { immediate: true }
)
</script>

<style>
:root {
  --bg-primary: #1a1a1a;
  --bg-secondary: #242424;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --border: #333333;
  --primary: #18a058;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
}

.app-container {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  padding: 0 16px;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
}

.sidebar {
  width: 220px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid var(--border);
}

.logo h1 {
  font-size: 20px;
  margin-bottom: 4px;
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
}

.overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .mobile-header {
    display: flex;
  }

  .sidebar {
    position: fixed;
    left: 0;
    top: 56px;
    bottom: 0;
    width: 280px;
    transform: translateX(-100%);
    z-index: 100;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .overlay {
    display: block;
  }

  .main-content {
    padding: 70px 16px 16px;
  }
}
</style>
