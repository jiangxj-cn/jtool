# JTool 快速开始指南

## 🎯 目标

5 分钟内让 JTool 跑起来！

---

## 📋 前置条件

### 1. 安装 Node.js (>= 18)

**Windows:**
```powershell
# 下载安装包
https://nodejs.org/zh-cn/download/

# 验证安装
node --version  # 应该显示 v18.x.x 或更高
npm --version   # 应该显示 9.x.x 或更高
```

### 2. 安装 Rust

**Windows:**
```powershell
# 下载安装 rustup
https://rustup.rs/

# 验证安装
rustc --version  # 应该显示 1.70.0 或更高
cargo --version
```

### 3. 安装 Visual Studio Build Tools

Rust 在 Windows 上需要 MSVC 编译器：

1. 下载：https://visualstudio.microsoft.com/zh-hans/downloads/
2. 选择 "桌面级的 C++ 开发"
3. 安装

---

## 🚀 快速启动

### 步骤 1: 进入项目目录

```bash
cd /home/admin/.openclaw/workspace/projects/jtool
```

### 步骤 2: 安装依赖

```bash
npm install
```

**预期输出：**
```
added 150 packages in 30s
```

### 步骤 3: 启动开发模式

```bash
npm run tauri dev
```

**预期行为：**
1. 自动打开一个窗口
2. 显示 JTool 界面
3. 左侧是工具菜单
4. 右侧是工具内容

---

## 🏗️ 构建发布版

### 构建命令

```bash
npm run tauri build
```

### 输出位置

构建完成后，安装包位于：

```
src-tauri/target/release/bundle/
├── nsis/
│   └── JTool_0.1.0_x64-setup.exe    # NSIS 安装包
└── msi/
    └── JTool_0.1.0_x64.msi          # MSI 安装包
```

---

## 🐛 常见问题

### Q1: `npm run tauri dev` 失败

**错误信息：** `could not find a Cargo.toml`

**解决：** 确保在正确目录执行，应该有 `src-tauri/Cargo.toml`

---

### Q2: Rust 编译错误

**错误信息：** `linker 'link.exe' not found`

**解决：** 安装 Visual Studio Build Tools（见上方）

---

### Q3: 窗口是空白的

**可能原因：** 前端构建失败

**解决：**
```bash
# 清理并重新构建
rm -rf dist/
npm run build
npm run tauri dev
```

---

### Q4: 依赖安装慢

**解决：** 使用淘宝镜像

```bash
npm config set registry https://registry.npmmirror.com
npm install
```

---

## 📚 下一步

- [ ] 阅读 `docs/01-project-design.md` 了解架构
- [ ] 添加新工具参考现有组件
- [ ] 修改 `src/App.vue` 调整 UI

---

## 💡 开发技巧

### 热重载

开发模式下，修改代码会自动刷新窗口。

### 调试

按 `Ctrl+Shift+I` 打开开发者工具。

### 查看日志

Rust 后端日志会输出到控制台。

---

**祝你开发愉快！** 🎉
