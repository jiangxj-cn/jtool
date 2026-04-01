# JTool Web 版开发计划

**创建时间**: 2026-04-01  
**版本**: v0.1.0  
**状态**: 🟢 开发中

---

## 🎯 目标

开发 JTool Web 版本，与 Windows 桌面版共享核心工具代码，实现：
- ✅ 一套代码，多端运行（Web + Windows）
- ✅ 核心工具逻辑复用
- ✅ 响应式设计，支持 PC 和移动端
- ✅ PWA 支持，可离线使用

---

## 📊 架构设计

### 代码组织

```
jtool/
├── packages/
│   ├── core/           # 核心工具逻辑（共享）
│   │   ├── hash/       # 哈希计算
│   │   ├── base64/     # BASE64
│   │   ├── timestamp/  # 时间戳
│   │   ├── json/       # JSON 工具
│   │   ├── qrcode/     # 二维码
│   │   ├── url/        # URL 编码
│   │   └── text/       # 文本处理
│   ├── web/            # Web 版前端
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   └── desktop/        # Windows 桌面版（Tauri）
│       ├── src/
│       ├── src-tauri/
│       └── package.json
```

### 技术栈

| 层级 | 技术 |
|------|------|
| **核心逻辑** | TypeScript (纯函数，无 UI) |
| **Web 版** | Vue 3 + Vite + Naive UI |
| **桌面版** | Tauri v2 + Vue 3 |
| **构建工具** | pnpm workspace / Turborepo |

---

## 📋 开发阶段

### Phase 1: 项目重构（Day 1-2）

**目标**: 将现有代码拆分为 monorepo 结构

- [ ] 初始化 pnpm workspace
- [ ] 创建 `packages/core` 提取工具逻辑
- [ ] 迁移现有工具到 core
- [ ] 更新桌面版依赖 core
- [ ] 创建 Web 版项目框架

**输出**:
- ✅ 可复用的核心工具包
- ✅ 桌面版正常工作
- ✅ Web 版基础框架

---

### Phase 2: Web 版开发（Day 2-3）

**目标**: 实现 Web 版 UI 和功能

- [ ] 创建 Web 版主界面
- [ ] 实现响应式布局
- [ ] 集成 7 个核心工具
- [ ] 添加 PWA 支持
- [ ] 优化移动端体验

**输出**:
- ✅ Web 版可访问
- ✅ 7 个工具全部可用
- ✅ 支持离线使用

---

### Phase 3: 优化与部署（Day 4）

**目标**: 部署 Web 版，优化性能

- [ ] 配置 Vercel/Netlify 部署
- [ ] 添加自定义域名
- [ ] 性能优化（懒加载、代码分割）
- [ ] SEO 优化
- [ ] 添加分析工具

**输出**:
- ✅ 线上版本：https://jtool.app
- ✅ 性能达标（Lighthouse 90+）
- ✅ 访问统计

---

## 🎨 UI 设计

### 布局方案

```
┌─────────────────────────────────────┐
│  JTool          [🌙] [📱] [≡]      │
├─────────────┬───────────────────────┤
│             │                       │
│  工具列表   │    工具内容区         │
│  • 哈希     │                       │
│  • BASE64   │                       │
│  • 时间戳   │                       │
│  • JSON     │                       │
│  • 二维码   │                       │
│  • URL      │                       │
│  • 文本     │                       │
│             │                       │
└─────────────┴───────────────────────┘
```

### 响应式断点

| 断点 | 宽度 | 布局 |
|------|------|------|
| Mobile | < 768px | 单列，汉堡菜单 |
| Tablet | 768-1024px | 双列，可折叠侧边栏 |
| Desktop | > 1024px | 双列，固定侧边栏 |

---

## 📦 核心工具 API 设计

### 示例：哈希工具

```typescript
// packages/core/hash/index.ts
export interface HashOptions {
  algorithm: 'md5' | 'sha1' | 'sha256' | 'sha512';
  input: string;
}

export interface HashResult {
  algorithm: string;
  hash: string;
  input: string;
}

export function calculateHash(options: HashOptions): HashResult {
  // 实现
}

export function calculateAllHashes(input: string): Record<string, string> {
  // 实现
}
```

---

## 🚀 部署方案

### Web 版

**平台**: Vercel（首选）或 Netlify

**配置**:
```json
{
  "buildCommand": "pnpm build:web",
  "outputDirectory": "packages/web/dist",
  "devCommand": "pnpm dev:web"
}
```

**域名**: 
- 主域名：`jtool.app` (或 `jtool.vercel.app`)
- 备用：`jiangxj-cn.github.io/jtool`

### 桌面版

**分发**:
- GitHub Releases
- 微软商店（可选）

---

## 📊 性能目标

### Web 版

| 指标 | 目标值 |
|------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Performance | > 90 |
| Bundle Size | < 500KB (gzip) |
| Offline Support | ✅ |

### 桌面版

| 指标 | 目标值 |
|------|--------|
| 安装包大小 | < 15MB |
| 启动时间 | < 2s |
| 内存占用 | < 200MB |

---

## 🔄 开发工作流

### 本地开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev          # 同时启动 Web 和 Desktop
pnpm dev:web      # 只开发 Web
pnpm dev:desktop  # 只开发桌面

# 构建
pnpm build        # 构建所有
pnpm build:web    # 只构建 Web
pnpm build:desktop # 只构建桌面

# 测试
pnpm test         # 运行核心工具测试
```

### 代码提交

```bash
# 提交规范
git commit -m "feat(core): 添加 SHA3 哈希支持"
git commit -m "feat(web): 实现响应式布局"
git commit -m "fix(desktop): 修复图标加载问题"
```

---

## 📝 任务清单

### 立即执行

- [ ] 创建 monorepo 结构
- [ ] 提取核心工具逻辑
- [ ] 创建 Web 版项目
- [ ] 实现基础 UI

### 本周完成

- [ ] 7 个工具全部实现
- [ ] PWA 支持
- [ ] 部署到 Vercel
- [ ] 性能优化

### 后续优化

- [ ] 添加更多工具（进制转换、正则等）
- [ ] 暗黑模式切换
- [ ] 工具历史记录
- [ ] 快捷键支持
- [ ] 国际化（i18n）

---

**下一步**: 开始 Phase 1 - 项目重构 🚀
