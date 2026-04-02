# Jtool JSON 工具 - 快速启动指南

## 🚀 5 分钟快速启动

### 步骤 1：安装依赖（2 分钟）

```bash
cd /home/admin/.openclaw/workspace/jtool-fix

# 使用 npm
npm install

# 或使用 pnpm（如果已安装）
pnpm install
```

### 步骤 2：启动开发服务器（1 分钟）

```bash
cd packages/web
npm run dev
```

### 步骤 3：访问工具（立即）

打开浏览器访问：**http://localhost:5173/json**

---

## ✅ 快速验证（1 分钟）

### 测试 1：格式化 JSON
```json
// 在左侧输入
{"name":"John","age":30,"city":"New York"}

// 点击"格式化"按钮或按 Ctrl+S

// 右侧应显示
{
  "name": "John",
  "age": 30,
  "city": "New York"
}
```

### 测试 2：转义功能
```json
// 在"转义工具" Tab 输入
Hello "World" with \n

// 点击"字符串转义"

// 应显示
Hello \"World\" with \\n
```

### 测试 3：实时校验
```
输入 { → 显示"JSON 无效"（红色）
输入 {"name": "John"} → 显示"JSON 有效"（绿色）
```

---

## 🎯 核心功能速览

### 基础功能 Tab
- **格式化** (Ctrl+S)：美化 JSON
- **校验**：检查 JSON 有效性
- **压缩**：最小化 JSON

### 转义工具 Tab
- **字符串转义**：转义特殊字符
- **去除转义**：还原转义字符
- **全部转义**：转义所有字符
- **全部去转义**：还原所有转义

### JSONPath 查询 Tab
- 输入 JSON 和查询表达式
- 支持复杂的 JSONPath 语法
- 显示匹配结果数量

### 格式转换 Tab
- JSON ↔ YAML
- JSON ↔ XML
- JSON ↔ CSV
- JSON → JavaScript

### 多语言转义 Tab
- Java、Go、Python、JavaScript 等
- 语言特定的转义规则

### 差异比较 Tab
- 比较两个 JSON 的差异
- 显示"有差异"或"无差异"

---

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+S` | 格式化 JSON |
| `Ctrl+Shift+C` | 复制输出 |
| `Ctrl+Delete` | 清空所有内容 |

---

## 🛠️ 故障排除

### 问题 1：页面空白
**解决：**
```bash
# 检查 Node.js 版本
node -v  # 需要 v18+

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

### 问题 2：Monaco Editor 不加载
**解决：**
- 检查网络连接（需要访问 CDN）
- 打开控制台查看错误信息
- 自动降级到普通 textarea（不影响功能）

### 问题 3：端口被占用
**解决：**
```bash
# 修改 vite.config.ts 中的端口
# 或使用其他端口
npm run dev -- --port 5174
```

### 问题 4：转义功能不工作
**解决：**
- 确保输入内容正确
- 检查控制台是否有错误
- 刷新页面重试

---

## 📱 移动端访问

在手机上访问开发服务器：

1. 确保手机和电脑在同一网络
2. 查看开发服务器日志中的 Network 地址
   ```
   ➜  Local:   http://localhost:5173/
   ➜  Network: http://192.168.1.100:5173/
   ```
3. 在手机浏览器访问 Network 地址

---

## 📚 更多文档

- [UI_OPTIMIZATION.md](./UI_OPTIMIZATION.md) - UI 优化详细说明
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - 完整测试指南
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - 实施总结

---

## 🎉 开始使用

现在你已经准备好了！访问 **http://localhost:5173/json** 开始使用优化后的 JSON 工具吧！

如有问题，请查看 [TESTING_GUIDE.md](./TESTING_GUIDE.md) 中的故障排除部分。
