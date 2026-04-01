#!/bin/bash

# JTool 快速发布脚本
# 用法：./scripts/release.sh

set -e

echo "🚀 JTool 快速发布脚本"
echo "===================="
echo ""

# 读取版本号
VERSION=$(grep '"version":' package.json | cut -d'"' -f4)

echo "当前版本：v$VERSION"
echo ""

# 确认
read -p "是否发布 v$VERSION？(y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 取消发布"
    exit 1
fi

# 检查远程仓库
if ! git remote -v | grep -q origin; then
    echo "❌ 未配置远程仓库"
    echo ""
    echo "请先添加远程仓库："
    echo "  git remote add origin https://github.com/YOUR_USERNAME/jtool.git"
    exit 1
fi

echo "✅ 开始发布流程..."
echo ""

# 提交所有变更
if [[ -n $(git status -s) ]]; then
    echo "📝 提交未提交的变更..."
    git add -A
    git commit -m "chore: 发布准备 v$VERSION"
fi

# 推送主分支
echo "📤 推送主分支..."
git push origin main

# 创建标签
echo "🏷️  创建标签 v$VERSION..."
git tag -a v$VERSION -m "Release v$VERSION"

# 推送标签（触发 GitHub Actions）
echo "🚀 推送标签，触发自动打包..."
git push origin v$VERSION

echo ""
echo "✅ 发布成功！"
echo ""
echo "📦 GitHub Actions 正在构建..."
echo "🔗 查看进度：https://github.com/YOUR_USERNAME/jtool/actions"
echo ""
echo "⏱️  预计 5-10 分钟后可以在 Releases 下载安装包"
echo "🔗 下载地址：https://github.com/YOUR_USERNAME/jtool/releases"
echo ""
