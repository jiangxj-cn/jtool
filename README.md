# JTool - Windows 开发者工具集

一个基于 Tauri v2 的轻量级 Windows 桌面开发者工具集。

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ 特性

- 🚀 **快速启动** - 秒开，无需等待
- 💾 **体积小** - 安装包 < 10MB
- 🔒 **纯本地** - 无需网络，数据不离本机
- 🎨 **深色主题** - 灰色系，护眼舒适
- 🛠️ **7 个核心工具** - 满足日常开发需求

## 🛠️ 工具清单

| 工具 | 功能 |
|------|------|
| 📐 哈希计算 | MD5, SHA1, SHA256, SHA512 |
| 🔐 BASE64 | 编码/解码 |
| 🕐 时间戳转换 | 时间戳 ↔ 日期 |
| 📝 JSON 工具 | 格式化/校验/压缩 |
| 📱 二维码 | 生成二维码 |
| 🔗 URL 编码 | 编码/解码 |
| 📄 文本处理 | 大小写/去重/排序/统计 |

## 📦 安装

### 从源码构建

```bash
# 1. 安装依赖
npm install

# 2. 开发模式运行
npm run tauri dev

# 3. 构建发布版
npm run tauri build
```

### 下载安装包

构建完成后，安装包位于：
- `src-tauri/target/release/bundle/nsis/JTool_0.1.0_x64-setup.exe`
- `src-tauri/target/release/bundle/msi/JTool_0.1.0_x64.msi`

## 🚀 开发

### 环境要求

- Node.js >= 18
- Rust >= 1.70
- Windows 10/11

### 项目结构

```
jtool/
├── src/                    # 前端源码
│   ├── components/         # 工具组件
│   ├── App.vue            # 主应用
│   └── main.ts            # 入口
├── src-tauri/             # Tauri 后端
│   ├── src/main.rs        # Rust 入口
│   └── tauri.conf.json    # Tauri 配置
├── docs/                  # 文档
└── package.json           # 项目配置
```

## 📝 更新日志

### v0.1.0 (2026-04-01)
- 🎉 首次发布
- ✅ 7 个核心工具
- ✅ 灰色系深色主题
- ✅ Windows 安装包

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
