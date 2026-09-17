<template>
  <n-config-provider :theme="isDark ? darkTheme : lightTheme">
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
            <n-space vertical size="small">
              <n-button quaternary size="small" block @click="toggleTheme">
                {{ isDark ? '☀️ 浅色' : '🌙 深色' }}
              </n-button>
              <LogViewer />
            </n-space>
          </div>
        </aside>

        <!-- 主内容区 -->
        <!-- 重要：不要再用 transition 的 out-in 模式包裹懒加载路由组件。
             路由组件是动态 import 的异步组件，快速/多次切换时其 leave 阶段可能被替换，
             Vue 内部 isLeaving 标志会卡住，导致之后所有路由都渲染不出来
             （表现就是「切换多了就切不动了」）。这里改为最直接的方式，并套错误边界兜底。 -->
        <main class="main-content">
          <router-view v-slot="{ Component, route }">
            <ErrorBoundary>
              <component :is="Component" :key="route.path" />
            </ErrorBoundary>
          </router-view>
        </main>

        <!-- 移动端遮罩 -->
        <div v-if="showMenu" class="overlay" @click="toggleMenu"></div>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { darkTheme, lightTheme, NConfigProvider, NMessageProvider, NMenu, NButton, NSpace } from 'naive-ui'
import ErrorBoundary from './components/common/ErrorBoundary.vue'
import LogViewer from './components/common/LogViewer.vue'
import { logError } from './utils/logger'

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

// 依据当前真实路由回写菜单选中项，避免「导航失败但菜单已高亮新项」造成的假死
const syncActiveFromRoute = () => {
  const p = route.path
  if (p === '/') {
    activeTool.value = 'home'
    return
  }
  const key = p.substring(1)
  activeTool.value = menuOptions.some(opt => opt.key === key) ? key : 'home'
}

const handleToolChange = async (key: string) => {
  const target = key === 'home' ? '/' : `/${key}`
  try {
    await router.push(target)
  } catch (e) {
    // 例如懒加载 chunk 加载失败。记录后回滚菜单高亮，保证仍然可以继续切换
    logError('navigation', `菜单跳转失败: ${target}`, e)
  } finally {
    syncActiveFromRoute()
  }
  if (window.innerWidth < 768) {
    showMenu.value = false
  }
}

// 监听路由变化，同步菜单选中状态
watch(
  () => route.path,
  () => syncActiveFromRoute(),
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
