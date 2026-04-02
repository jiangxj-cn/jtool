# Monaco Editor 集成指南

## 方案选择

由于 Monaco Editor 体积较大（~20MB），我们采用**可选加载**方案：

1. **默认使用 Naive UI 的 textarea**（带等宽字体）
2. **可选通过 CDN 加载 Monaco Editor**
3. **自动降级**：Monaco 不可用时自动使用 textarea

## 使用方法

### 方案一：通过 CDN 加载（推荐）

在 `index.html` 中添加：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jtool - JSON 工具</title>
  <!-- 加载 Monaco Editor -->
  <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.min.js"></script>
  <script>
    // 配置 Monaco
    window.require = {
      paths: {
        vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
      }
    }
  </script>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

### 方案二：通过 npm 安装

```bash
npm install monaco-editor
```

然后在 `vite.config.ts` 中添加配置：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Monaco Editor 配置
  worker: {
    format: 'es',
  },
})
```

在 `main.ts` 中加载：

```typescript
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }
    return new editorWorker()
  },
}

// 挂载到 window 供组件使用
window.monaco = monaco
```

## 当前实现

当前代码已经支持**自动检测和降级**：

```typescript
const initMonacoEditor = () => {
  // 检查 Monaco 是否可用
  if (typeof (window as any).monaco !== 'undefined') {
    useMonaco.value = true
    // 初始化编辑器...
  } else {
    // 自动降级到普通 textarea
    useMonaco.value = false
  }
}
```

## 验证

启动开发服务器后，打开浏览器控制台检查：

```javascript
// 如果 Monaco 加载成功
typeof window.monaco !== 'undefined' // true

// 如果降级到 textarea
typeof window.monaco === 'undefined' // true
```

## 样式优化

代码已经为两种模式都提供了样式：

```css
/* Monaco Editor 容器 */
.monaco-editor {
  width: 100%;
  height: 300px;
}

/* 降级 textarea */
.fallback-textarea :deep(.n-input__textarea) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
}
```

## 推荐配置

对于生产环境，建议使用**方案一（CDN）**，原因：

1. ✅ 不增加打包体积
2. ✅ 利用 CDN 缓存
3. ✅ 加载速度快
4. ✅ 配置简单

对于开发环境，可以使用**方案二（npm）**，原因：

1. ✅ 本地开发更快
2. ✅ 离线可用
3. ✅ 版本可控
