# JTool 发布与下载指南

**创建时间**: 2026-04-01  
**版本**: v0.1.0

---

## 🚀 自动打包流程

### 1. 推送到 GitHub

```bash
# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/jtool.git

# 推送代码
git push -u origin main

# 打标签（触发自动打包）
git tag v0.1.0
git push origin v0.1.0
```

### 2. GitHub Actions 自动构建

推送标签后，GitHub Actions 会自动：
- ✅ 在 Windows 环境编译
- ✅ 生成 MSI 和 NSIS 安装包
- ✅ 创建 GitHub Release
- ✅ 上传安装包

### 3. 下载安装包

**方式 1: GitHub Releases（推荐）**

访问：`https://github.com/YOUR_USERNAME/jtool/releases`

下载：
- `JTool_0.1.0_x64-setup.exe` - NSIS 安装包（推荐）
- `JTool_0.1.0_x64.msi` - MSI 安装包

**方式 2: GitHub Actions Artifacts**

1. 进入 Actions 页面
2. 点击最新的构建
3. 下载 artifacts 中的安装包

---

## 📦 安装包说明

### NSIS 安装包（推荐）

**文件名**: `JTool_0.1.0_x64-setup.exe`

**特点**:
- ✅ 支持自定义安装路径
- ✅ 创建桌面快捷方式
- ✅ 支持卸载
- ✅ 体积较小（约 5-8MB）

**安装步骤**:
1. 双击 `.exe` 文件
2. 选择安装路径
3. 点击安装
4. 完成

### MSI 安装包

**文件名**: `JTool_0.1.0_x64.msi`

**特点**:
- ✅ Windows 标准安装包
- ✅ 支持企业部署
- ✅ 可通过组策略分发

**安装步骤**:
1. 双击 `.msi` 文件
2. 按向导完成安装

---

## 🔧 本地打包（可选）

如果你想自己打包：

### 环境要求

- Windows 10/11
- Node.js >= 18
- Rust >= 1.70
- Visual Studio Build Tools

### 打包步骤

```bash
# 1. 安装依赖
npm install

# 2. 打包
npm run tauri build

# 3. 查看输出
ls src-tauri/target/release/bundle/
```

### 输出文件

```
src-tauri/target/release/bundle/
├── nsis/
│   └── JTool_0.1.0_x64-setup.exe
└── msi/
    └── JTool_0.1.0_x64.msi
```

---

## 📊 构建状态

### 最新构建

| 版本 | 状态 | 时间 | 下载 |
|------|------|------|------|
| v0.1.0 | 🟡 待构建 | - | - |

### 构建历史

访问 GitHub Actions 页面查看完整历史。

---

## 🐛 安装问题

### Q1: Windows 提示"未知发布者"

**原因**: 未签名证书

**解决**: 点击"更多信息" → "仍要运行"

---

### Q2: 安装失败

**可能原因**:
- 系统版本过旧（需要 Win10+）
- 缺少运行库

**解决**:
1. 确保 Windows 10/11
2. 安装 [Visual C++ Redistributable](https://aka.ms/vs/17/release/vc_redist.x64.exe)

---

### Q3: 杀毒软件报毒

**原因**: 未签名应用

**解决**:
1. 添加到杀毒软件白名单
2. 或选择本地打包

---

## 📝 版本发布流程

### 开发版本

```bash
# 日常开发，不触发自动打包
git push origin main
```

### 正式发布

```bash
# 1. 更新版本号（package.json 和 tauri.conf.json）
# 2. 提交
git commit -am "release: v0.1.0"

# 3. 打标签
git tag v0.1.0

# 4. 推送标签（触发自动打包）
git push origin v0.1.0
```

---

## 🎯 下一步

1. **创建 GitHub 仓库**
   ```bash
   # 在 GitHub 创建空仓库
   # 然后执行：
   git remote add origin https://github.com/YOUR_USERNAME/jtool.git
   git push -u origin main
   ```

2. **推送标签触发打包**
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

3. **等待构建完成**（约 5-10 分钟）

4. **下载安装包**

---

**准备好推送到 GitHub 了吗？** 🚀
