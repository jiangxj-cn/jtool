# JTool - 全平台开发者工具集

一个基于 Vue 3 + Vite 的现代化 Web 开发者工具集，支持桌面端和移动端。

![Version](https://img.shields.io/badge/version-0.2.4-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)

## ✨ 特性

- 🚀 **快速启动** - 秒开，无需安装
- 💾 **轻量级** - 构建体积 < 2MB
- 🔒 **纯本地** - 数据不离浏览器
- 🎨 **响应式设计** - 适配桌面和移动端
- 🛠️ **16 个专业工具** - 满足开发全流程需求

## 🛠️ 工具清单

### 📝 数据处理
| 工具 | 功能 |
|------|------|
| 📝 **JSON 工具** | 格式化/校验/压缩/转义/JSONPath 查询/格式转换/差异比较 |
| 🔐 **BASE64** | 编码/解码 |
| 🔗 **URL 工具** | 编码/解码 |
| 📄 **文本工具** | 大小写转换/去重/排序/统计 |

### 🔧 开发工具
| 工具 | 功能 |
|------|------|
| 📐 **哈希计算** | MD5, SHA1, SHA256, SHA512 |
| 🕐 **时间戳** | 时间戳 ↔ 日期转换 |
| 🔍 **正则测试** | 正则表达式匹配测试 |
| 🎫 **JWT 解析** | JWT 解码/验证 |
| 🔢 **ASCII 工具** | ASCII 编码转换 |
| 🔖 **UUID 生成** | UUID/GUID 生成 |
| 🎲 **随机字符** | 随机字符串/密码/数字生成 |

### 🌐 网络工具
| 工具 | 功能 |
|------|------|
| 📱 **二维码** | 二维码生成 |
| 🌐 **IP 计算器** | IP 地址计算/子网掩码 |

### 📊 其他工具
| 工具 | 功能 |
|------|------|
| 🔄 **单位换算** | 长度/重量/温度等换算 |
| ⛽ **油价查询** | 全国各省市油价查询 |

## 🚀 使用方式

### Web 版（推荐）

**在线访问**：
```
http://47.251.107.60:8001/
```

**特点**：
- ✅ 无需安装，打开即用
- ✅ 自动更新
- ✅ 跨平台访问

### 桌面版（开发中）

基于 Tauri v2 构建，支持 Windows/macOS/Linux。

**从源码构建**：
```bash
# 1. 安装依赖
pnpm install

# 2. 开发模式
pnpm dev:desktop

# 3. 构建发布版
pnpm tauri build
```

**安装包位置**：
- Windows: `src-tauri/target/release/bundle/nsis/`
- macOS: `src-tauri/target/release/bundle/dmg/`
- Linux: `src-tauri/target/release/bundle/deb/`

## 📦 技术栈

### 前端
- **Vue 3** - 渐进式 JavaScript 框架
- **Vite 5** - 下一代前端构建工具
- **Naive UI** - Vue 3 组件库
- **TypeScript** - 类型安全

### 后端（桌面版）
- **Tauri v2** -  Rust 桌面应用框架
- **Rust** - 系统级编程语言

## 📊 性能指标

| 指标 | 数值 |
|------|------|
| 构建体积 | ~1.8 MB |
| 构建时间 | ~18 秒 |
| 首屏加载 | < 1 秒 |
| Gzip 压缩率 | 73% |

## 📝 更新日志

### v0.2.4 (2026-04-09)
- ✨ **JSON 工具增强**
  - JSONPath 查询功能
  - 格式转换（JSON ↔ YAML/XML/CSV）
  - 多语言转义（Java/Go/Python/JS 等）
  - 差异比较功能
- 🎨 **UI 优化**
  - 统一输入框高度（600px）
  - 统一按钮样式
  - 响应式布局优化
- ⚡ **性能优化**
  - 代码分割优化
  - 构建体积减少 10%
  - 构建时间减少 16%
- 🐛 **Bug 修复**
  - 修复随机字符生成结果显示问题
  - 修复转义工具功能

### v0.2.0 (2026-04-07)
- ✨ 新增工具：正则测试、JWT 解析、油价查询
- 🎨 界面优化：左右分栏布局、Monaco Editor 代码高亮
- ⚡ 性能优化：路由懒加载、骨架屏

### v0.1.0 (2026-04-01)
- 🎉 首次发布
- ✅ 7 个核心工具
- ✅ 深色主题

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发流程
```bash
# 1. Fork 项目
# 2. 创建功能分支 (git checkout -b feature/AmazingFeature)
# 3. 提交更改 (git commit -m 'Add some AmazingFeature')
# 4. 推送到分支 (git push origin feature/AmazingFeature)
# 5. 开启 Pull Request
```

## 📄 许可证

MIT License

## 📞 联系方式

- **项目地址**: https://github.com/jiangxj-cn/jtool
- **在线访问**: http://47.251.107.60:8001/

---

Made with ❤️ by 江
