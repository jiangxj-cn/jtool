# ⚠️ GitHub Actions 配置说明

## ✅ 已完成

- 代码已推送到 GitHub: https://github.com/jiangxj-cn/jtool
- 主分支：main
- 当前提交：578f294

---

## ❌ 未完成的（需要手动操作）

### GitHub Actions 工作流文件

由于当前 GitHub Token 缺少 `workflow` 权限，无法自动推送 `.github/workflows/build.yml`。

**解决方案（2 选 1）：**

### 方案 A：手动添加工作流文件（推荐）

1. **访问仓库**：
   https://github.com/jiangxj-cn/jtool

2. **创建文件**：
   - 点击 "Add file" → "Create new file"
   - 文件名：`.github/workflows/build.yml`
   - 复制以下内容：

```yaml
name: Build Windows App

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:

jobs:
  build-windows:
    runs-on: windows-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Rust
        uses: dtolnay/rust-toolchain@stable

      - name: Install dependencies
        run: npm ci

      - name: Build Tauri App
        run: npm run tauri build
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Upload MSI Installer
        uses: actions/upload-artifact@v4
        with:
          name: JTool-MSI-Installer
          path: src-tauri/target/release/bundle/msi/*.msi

      - name: Upload NSIS Installer
        uses: actions/upload-artifact@v4
        with:
          name: JTool-NSIS-Installer
          path: src-tauri/target/release/bundle/nsis/*.exe

      - name: Create Release
        if: startsWith(github.ref, 'refs/tags/')
        uses: softprops/action-gh-release@v1
        with:
          files: |
            src-tauri/target/release/bundle/msi/*.msi
            src-tauri/target/release/bundle/nsis/*.exe
          generate_release_notes: true
          draft: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

3. **点击 "Commit new file"**

4. **推送标签触发构建**：
   ```bash
   cd /home/admin/.openclaw/workspace/projects/jtool
   git tag v0.1.0
   git push origin v0.1.0
   ```

---

### 方案 B：更新 Token 权限

1. **创建新的 Token（带 workflow 权限）**：
   - 访问：https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - 勾选权限：
     - ✅ `repo` (全部)
     - ✅ `workflow`
   - 生成 Token

2. **更新 remote URL**：
   ```bash
   cd /home/admin/.openclaw/workspace/projects/jtool
   git remote set-url origin https://jiangxj-cn:NEW_TOKEN@github.com/jiangxj-cn/jtool.git
   ```

3. **推送工作流文件**：
   ```bash
   git add .github/workflows/build.yml
   git commit -m "feat: 添加 GitHub Actions 工作流"
   git push origin main
   git push origin v0.1.0
   ```

---

## 📦 构建完成后

访问 Actions 页面查看构建进度：
https://github.com/jiangxj-cn/jtool/actions

构建完成后在 Releases 下载安装包：
https://github.com/jiangxj-cn/jtool/releases

---

**创建时间**: 2026-04-01 16:55
