# Jtool 新功能开发 + 性能优化实施计划

## 📋 任务概述

### 任务一：增强现有工具功能

#### 1. 时间戳转换工具增强
**现状**: 基础时间戳 ↔ 日期转换，无时区选择
**需要增强**:
- ✅ 支持毫秒/秒单位切换
- ✅ 常用时区选择下拉框 (UTC, CST, PST, EST, JST 等)
- ✅ 显示多种格式 (ISO, Unix, 人类可读)
- ✅ 快捷时间选择 (1 小时前、1 天前、1 周前等)

#### 2. 正则表达式测试工具增强
**现状**: 基础匹配和替换，无高亮
**需要增强**:
- ✅ 匹配结果高亮显示 (在原文本中标记)
- ✅ 匹配组 (groups) 显示
- ✅ 常用正则模板快速插入
- ✅ 实时匹配 (输入时自动测试)
- ✅ 匹配统计信息

#### 3. JWT 解析工具增强
**现状**: 基础解码，无签名验证
**需要增强**:
- ✅ JWT 签名验证 (支持 HS256, RS256)
- ✅ 过期时间可视化 (倒计时/进度条)
- ✅ 标准字段解析 (iat, exp, nbf, iss, sub 等)
- ✅ 生成 JWT 功能 (可选)

### 任务二：性能优化

#### 1. 代码分割 (Code Splitting)
**目标**: 减少初始加载包体积
**实施**:
- ✅ 按工具路由分割 chunk
- ✅ 动态 import 工具组件
- ✅ 路由懒加载
- ✅ 提取公共依赖 (vendor chunk)

#### 2. 构建优化
**目标**: 优化构建产物大小和加载速度
**实施**:
- ✅ 启用 gzip/brotli 压缩
- ✅ Tree shaking 优化
- ✅ 配置缓存策略 (cache-control headers)
- ✅ 优化 Vite build 配置

#### 3. 加载优化
**目标**: 提升用户体验
**实施**:
- ✅ 骨架屏 (Skeleton) 加载状态
- ✅ 渐进式加载工具组件
- ✅ 预加载关键资源
- ✅ 路由切换加载指示器

---

## 🎯 实施步骤

### Phase 1: 功能增强 (1-2 小时)

#### Step 1.1: 时间戳工具增强
**文件**: `packages/web/src/components/timestamp/TimestampTool.vue`
**改动**:
1. 添加时区选择器 (n-select)
2. 添加毫秒/秒切换开关
3. 添加快捷时间按钮
4. 显示多种格式输出

**测试**:
- 时间戳 → 日期 (不同时区)
- 日期 → 时间戳 (毫秒/秒)
- 快捷时间计算准确性

#### Step 1.2: 正则工具增强
**文件**: `packages/web/src/components/regex/RegexTool.vue`
**改动**:
1. 添加匹配高亮功能 (使用 `<mark>` 标签)
2. 显示匹配组信息
3. 添加实时匹配开关
4. 优化常用正则模板展示

**测试**:
- 高亮显示正确性
- 匹配组解析准确性
- 性能 (长文本实时匹配)

#### Step 1.3: JWT 工具增强
**文件**: `packages/web/src/components/jwt/JWTTool.vue`
**改动**:
1. 添加签名验证输入框 (secret/key)
2. 添加过期时间倒计时
3. 增强标准字段显示
4. (可选) 添加 JWT 生成功能

**测试**:
- 签名验证准确性
- 过期时间计算
- 各种 JWT 格式兼容性

### Phase 2: 性能优化 (1-2 小时)

#### Step 2.1: 路由配置和代码分割
**文件**: 
- `packages/web/src/App.vue` (重构为路由)
- `packages/web/src/router/index.ts` (新建)

**改动**:
1. 安装 vue-router
2. 配置路由懒加载
3. 动态 import 组件
4. 添加路由过渡动画

**预期效果**:
- 初始加载包减少 60-70%
- 工具按需加载

#### Step 2.2: Vite 构建优化
**文件**: `packages/web/vite.config.ts`

**改动**:
1. 配置 build.rollupOptions 输出分割
2. 启用 gzip/brotli 压缩
3. 配置 manualChunks 提取 vendor
4. 优化 CSS 提取

**预期效果**:
- 构建产物减少 30-40%
- 加载速度提升 50%+

#### Step 2.3: 骨架屏和加载状态
**文件**: 
- `packages/web/src/components/common/ToolSkeleton.vue` (新建)
- 各工具组件添加 loading 状态

**改动**:
1. 创建通用骨架屏组件
2. 路由切换时显示加载状态
3. 添加进度指示器

---

## 📊 性能对比指标

### 优化前 (预估):
- 初始加载包大小：~500KB
- 首次内容绘制 (FCP): ~2-3s
- 可交互时间 (TTI): ~3-4s

### 优化后 (目标):
- 初始加载包大小：~150KB (-70%)
- 首次内容绘制 (FCP): ~0.5-1s (-60%)
- 可交互时间 (TTI): ~1-1.5s (-60%)

### 测量方法:
```bash
# 构建分析
pnpm build:web
# 使用 vite-bundle-visualize 分析包大小

# Lighthouse 测试
# 在 Chrome DevTools 中运行 Lighthouse
```

---

## 🧪 测试策略

### 单元测试 (核心功能):
```bash
pnpm test
```

### 手动测试清单:
- [ ] 时间戳转换 (不同时区、毫秒/秒)
- [ ] 正则匹配高亮 (各种正则)
- [ ] JWT 解码和验证
- [ ] 路由切换流畅度
- [ ] 移动端响应式
- [ ] 深色/浅色主题切换

---

## 📁 文件变更清单

### 新增文件:
```
packages/web/src/router/index.ts
packages/web/src/components/common/ToolSkeleton.vue
packages/web/src/views/Home.vue (可选)
```

### 修改文件:
```
packages/web/src/App.vue (重构为路由视图)
packages/web/src/components/timestamp/TimestampTool.vue
packages/web/src/components/regex/RegexTool.vue
packages/web/src/components/jwt/JWTTool.vue
packages/web/vite.config.ts
packages/web/package.json (添加 vue-router)
```

---

## ⚠️ 注意事项

1. **保持向后兼容**: 现有功能不能破坏
2. **渐进式增强**: 新功能作为增强，不影响基础功能
3. **性能优先**: 所有新增功能需考虑性能影响
4. **移动端优先**: 确保响应式设计正常工作
5. **测试驱动**: 关键功能先写测试

---

## 🚀 执行顺序

1. ✅ 功能增强 (Timestamp → Regex → JWT)
2. ✅ 路由重构 (App.vue → Router)
3. ✅ 构建优化 (vite.config.ts)
4. ✅ 加载优化 (骨架屏)
5. ✅ 性能测试和对比
6. ✅ 文档更新

---

**预计总耗时**: 2-4 小时
**风险**: 低 (现有代码结构清晰，改动局部)
**回滚方案**: Git branch 管理，可随时回退
