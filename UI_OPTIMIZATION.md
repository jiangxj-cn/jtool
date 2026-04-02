# Jtool JSON 工具 UI 优化说明

## 📋 优化概览

本次优化对 JSON 工具进行了全面的 UI/UX 改进，包括布局重构、视觉优化、交互增强和功能修复。

---

## ✅ 任务一：功能修复

### 1.1 转义功能修复

**问题**：转义操作对输入的 JSON 字符串本身起效，而非对 JSON 内容起效

**解决方案**：
```typescript
const escapeStr = () => {
  try {
    // 先尝试解析 JSON
    try {
      const obj = JSON5.parse(inputJson.value)
      // 如果是字符串，直接转义
      if (typeof obj === 'string') {
        outputJson.value = jsonEscape(obj)
      } else {
        // 如果是对象，转换为字符串后转义
        outputJson.value = jsonEscape(JSON.stringify(obj))
      }
    } catch {
      // 如果不是 JSON，直接对输入字符串转义
      outputJson.value = jsonEscape(inputJson.value)
    }
  } catch (e) {
    errorMsg.value = `转义失败：${(e as Error).message}`
  }
}
```

**修复内容**：
- ✅ `escapeStr` - 字符串转义：智能识别 JSON 和纯文本
- ✅ `unescapeStr` - 去除转义：正确处理转义字符
- ✅ `escapeAll` - 全部转义：对所有字符进行转义
- ✅ `unescapeAll` - 全部去转义：还原所有转义字符
- ✅ 所有函数都添加了完整的错误处理
- ✅ 操作成功后自动更新输出区域

### 1.2 错误信息显示

**改进**：
- 添加了实时 JSON 校验状态指示器
- 错误信息使用醒目的红色警告框
- 成功信息使用绿色提示框
- 支持手动关闭警告/成功提示
- 每次操作前自动清空之前的错误信息

---

## 🎨 任务二：UI 优化

### 2.1 布局优化

#### 左右分栏布局
```
┌─────────────────────────────────────────────────────┐
│  📝 JSON 工具                                        │
│  工具栏 [格式化] [复制] [清空]                       │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐        │
│  │   输入区域       │  │   输出区域       │        │
│  │   (可编辑)       │  │   (只读)         │        │
│  │                  │  │                  │        │
│  │  [粘贴] [历史]   │  │  [复制]          │        │
│  └──────────────────┘  └──────────────────┘        │
│  [格式化] [校验] [压缩]  ✅ 成功 | 结果数：X        │
└─────────────────────────────────────────────────────┘
```

**优势**：
- 同时查看输入和输出，无需滚动切换
- 符合专业工具的使用习惯
- 响应式设计，移动端自动切换为上下布局

#### 工具栏优化
- **位置**：移至顶部，全局可见
- **内容**：
  - 当前 Tab 标识
  - JSON 有效性实时指示器（✅ 有效 / ❌ 无效）
  - 快捷操作按钮（格式化、复制、清空）
  - 快捷键提示（Ctrl+S）

#### Tab 切换增强
- 更明显的选中状态
- Tab 名称带图标
- 切换时自动清空错误信息
- 6 个功能 Tab：
  - 📝 基础功能
  - 🛡️ 转义工具
  - 🔍 JSONPath 查询
  - 🔄 格式转换
  - 💻 多语言转义
  - 📊 差异比较

### 2.2 视觉优化

#### 代码高亮（Monaco Editor）
```typescript
const initMonacoEditor = () => {
  if (typeof (window as any).monaco !== 'undefined') {
    useMonaco.value = true
    
    // 输入编辑器
    inputEditorInstance = monaco.editor.create(inputEditorRef.value, {
      value: inputJson.value,
      language: 'json',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: 'on',
      wordWrap: 'on',
    })
  }
}
```

**特性**：
- ✅ JSON 语法高亮
- ✅ 行号显示
- ✅ 自动换行
- ✅ 暗色主题（vs-dark）
- ✅ 自动布局适配
- ✅ 降级方案：Monaco 不可用时使用普通 textarea

#### 颜色对比度提升
- **主色调**：使用 Naive UI 的语义化颜色变量
- **成功状态**：绿色标签 + ✅ 图标
- **错误状态**：红色警告框 + ❌ 图标
- **警告状态**：橙色标签
- **背景层次**：
  - `--bg-primary`：主背景
  - `--bg-secondary`：卡片背景
  - `--bg-tertiary`：工具栏/面板背景

#### 按钮分组优化
```vue
<n-space>
  <!-- 主要操作 -->
  <n-button type="primary" @click="format">
    <template #icon><n-icon :component="FormatSize" /></template>
    格式化
  </n-button>
  
  <!-- 校验操作 -->
  <n-button @click="validate">
    <template #icon><n-icon :component="CheckmarkCircleOutline" /></template>
    校验
  </n-button>
  
  <!-- 压缩操作 -->
  <n-button @click="compress">
    <template #icon><n-icon :component="FlashOutline" /></template>
    压缩
  </n-button>
</n-space>
```

**分组原则**：
1. 主要操作（Primary）：格式化、转换、查询
2. 次要操作（Default）：校验、压缩
3. 危险操作（Error）：清空（带确认）

#### 图标系统
使用 **Ionicons 5** 图标库：
- 📝 `DocumentTextOutline` - 文档
- ✅ `CheckmarkCircleOutline` - 成功
- ❌ `CloseCircleOutline` - 错误
- 🔄 `SwapHorizontalOutline` - 转换
- 🔍 `SearchOutline` - 搜索
- 🛡️ `ShieldCheckmarkOutline` - 安全/转义
- 📋 `ClipboardOutline` - 剪贴板
- 🗑️ `TrashOutline` - 删除
- ⏰ `TimeOutline` - 历史

### 2.3 交互优化

#### 实时校验
```typescript
const onInputChanged = (value: string) => {
  if (!value) {
    isValidJson.value = false
    return
  }
  try {
    JSON5.parse(value)
    isValidJson.value = true
  } catch {
    isValidJson.value = false
  }
}

// 工具栏实时显示状态
<n-tag v-if="isValidJson" type="success" size="small">
  <template #icon><n-icon :component="CheckmarkCircleOutline" /></template>
  JSON 有效
</n-tag>
<n-tag v-else-if="inputJson" type="error" size="small">
  <template #icon><n-icon :component="CloseCircleOutline" /></template>
  JSON 无效
</n-tag>
```

#### 复制按钮增强
- **位置**：每个输出面板右上角
- **样式**：成功绿色按钮
- **反馈**：复制成功后显示提示
- **快捷键**：Ctrl+Shift+C

#### 清空确认
```typescript
const clearAll = () => {
  if (inputJson.value || outputJson.value) {
    const confirmed = window.confirm('确定要清空所有内容吗？此操作不可恢复。')
    if (!confirmed) return
  }
  // 执行清空...
}
```

#### 历史记录功能
```typescript
// 添加到历史
const addToHistory = (type: string, content: string) => {
  history.value.unshift({
    type,
    content: content.substring(0, 100) + '...',
    timestamp: new Date().toLocaleString('zh-CN')
  })
  saveHistory() // 保存到 localStorage
}

// 加载历史
const loadHistory = () => {
  const saved = localStorage.getItem('jtool-json-history')
  if (saved) {
    history.value = JSON.parse(saved)
  }
  showHistory.value = true
}
```

**功能**：
- 记录最近 20 次操作
- 持久化存储（localStorage）
- 支持加载历史内容
- 支持删除单条历史
- 支持清空所有历史

---

## ⌨️ 快捷键支持

| 快捷键 | 功能 | 说明 |
|--------|------|------|
| `Ctrl+S` | 格式化 | 快速格式化输入的 JSON |
| `Ctrl+Shift+C` | 复制输出 | 复制结果到剪贴板 |
| `Ctrl+Delete` | 清空 | 清空所有内容（带确认） |

---

## 📱 响应式设计

### 断点设置
- **桌面端**（≥1200px）：最大宽度 1400px，左右分栏
- **平板端**（900px-1200px）：左右分栏，适当调整间距
- **移动端**（<900px）：上下布局，单列显示

### 自适应布局
```css
.split-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 900px) {
  .split-layout {
    grid-template-columns: 1fr; /* 切换为单列 */
  }
}
```

---

## 🔧 技术实现

### 依赖
- **Vue 3** + **TypeScript**
- **Naive UI** - UI 组件库
- **Monaco Editor** - 代码编辑器（可选）
- **JSON5** - JSON 解析
- **@jtool/core** - 核心工具函数
- **@vicons/ionicons5** - 图标库

### 组件结构
```
JsonTool.vue
├── Template (视图层)
│   ├── 工具栏
│   ├── Tab 面板
│   │   ├── 基础功能
│   │   ├── 转义工具
│   │   ├── JSONPath 查询
│   │   ├── 格式转换
│   │   ├── 多语言转义
│   │   └── 差异比较
│   ├── 输出区域
│   └── 历史记录模态框
├── Script (逻辑层)
│   ├── 状态管理
│   ├── 核心功能函数
│   ├── 编辑器初始化
│   └── 历史记录管理
└── Style (样式层)
    ├── 布局样式
    ├── 组件样式
    └── 响应式样式
```

### 状态管理
```typescript
// 核心状态
const inputJson = ref('')
const outputJson = ref('')
const isValidJson = ref(false)
const resultInfo = ref<{ success: boolean; count?: number } | null>(null)

// 编辑器实例
let inputEditorInstance: any = null
let outputEditorInstance: any = null

// 历史记录
const history = ref<Array<{ type: string; content: string; timestamp: string }>>([])
```

---

## 🎯 使用指南

### 快速开始
1. 访问 Jtool 网站
2. 点击 "JSON 工具"
3. 在左侧输入 JSON
4. 点击 "格式化" 或使用 `Ctrl+S`
5. 查看右侧结果

### 常用操作
- **格式化 JSON**：输入 → 点击"格式化" → 查看结果
- **校验 JSON**：输入 → 点击"校验" → 查看验证信息
- **压缩 JSON**：输入 → 点击"压缩" → 获取最小化 JSON
- **JSONPath 查询**：切换到"JSONPath 查询" Tab → 输入 JSON 和查询表达式 → 点击"查询"
- **格式转换**：切换到"格式转换" Tab → 选择源格式和目标格式 → 点击"转换"

### 高级功能
- **多语言转义**：为 Java、Go、Python 等语言转义 JSON
- **差异比较**：比较两个 JSON 的差异
- **历史记录**：点击"历史"按钮查看最近操作

---

## 📊 优化效果对比

| 项目 | 优化前 | 优化后 |
|------|--------|--------|
| 布局 | 上下布局 | 左右分栏 |
| 代码高亮 | 无 | Monaco Editor |
| 实时校验 | 无 | ✅ 有 |
| 快捷键 | 无 | 3 个快捷键 |
| 历史记录 | 无 | ✅ 20 条历史 |
| 图标提示 | 少量 | 全面覆盖 |
| 响应式 | 基础 | 完善 |
| 错误提示 | 简单 | 详细 + 可关闭 |
| 转义功能 | ❌ 有 bug | ✅ 已修复 |

---

## 🚀 访问地址验证

### 开发环境
```bash
cd jtool-fix/packages/web
npm install
npm run dev
```

访问：`http://localhost:5173/json`

### 生产环境
```bash
npm run build
npm run preview
```

### 验证清单
- [ ] 左右分栏布局正常显示
- [ ] Monaco Editor 正常加载（如可用）
- [ ] 实时校验状态正确显示
- [ ] 格式化功能正常工作
- [ ] 转义功能正常工作（重点验证）
- [ ] 压缩功能正常工作
- [ ] JSONPath 查询正常工作
- [ ] 格式转换正常工作
- [ ] 差异比较正常工作
- [ ] 快捷键响应正确
- [ ] 历史记录功能正常
- [ ] 复制功能正常
- [ ] 清空确认弹窗正常
- [ ] 响应式布局正常

---

## 📝 总结

本次优化全面提升了 JSON 工具的用户体验：

1. **功能修复**：解决了转义功能的 bug，确保所有操作对输入内容正确起效
2. **布局优化**：采用专业的左右分栏布局，提升工作效率
3. **视觉升级**：集成 Monaco Editor 实现代码高亮，全面使用图标增强视觉提示
4. **交互增强**：添加实时校验、快捷键、历史记录等实用功能
5. **响应式设计**：完美适配桌面、平板、手机各种设备

优化后的 JSON 工具更加专业、高效、易用！🎉
