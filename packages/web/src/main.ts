import { createApp } from 'vue'
import naive from 'naive-ui'
import router from './router'
import App from './App.vue'

// 调试日志 - 帮助诊断黑屏问题
console.log('[JTool] App starting...')
console.log('[JTool] Router mode:', router.options.history.constructor.name)

const app = createApp(App)
app.use(naive)
app.use(router)

// 路由就绪后挂载
router.isReady().then(() => {
  console.log('[JTool] Router ready, mounting app...')
  app.mount('#app')
  console.log('[JTool] App mounted successfully!')
}).catch(err => {
  console.error('[JTool] Router failed to initialize:', err)
})
