import { createApp } from 'vue'
import naive from 'naive-ui'
import router from './router'
import App from './App.vue'
import { installGlobalErrorHandlers, logInfo, logError } from './utils/logger'

const app = createApp(App)
app.use(naive)
app.use(router)

// 尽早装配全局错误捕获：未捕获异常 / Promise 拒绝 / Vue 组件异常 / 路由失败 / console.error
// 必须在 app.mount() 之前，否则挂载早期的错误会漏掉。
installGlobalErrorHandlers(app, router)

logInfo('bootstrap', '应用启动', `history=${router.options.history.constructor.name}`)

// 路由就绪后挂载
router.isReady()
  .then(() => {
    app.mount('#app')
    logInfo('bootstrap', '应用已挂载')
  })
  .catch((err) => {
    logError('bootstrap', '路由初始化失败，应用未能挂载', err)
  })
