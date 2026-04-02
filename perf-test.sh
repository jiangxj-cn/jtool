#!/bin/bash

# Jtool 性能测试脚本

echo "🚀 Jtool 性能测试"
echo "=================="

cd /home/admin/.openclaw/workspace/jtool-fix/packages/web

echo ""
echo "📦 步骤 1: 清理旧的构建产物"
rm -rf dist

echo ""
echo "🔨 步骤 2: 构建项目"
pnpm build

echo ""
echo "📊 步骤 3: 分析构建产物大小"
echo "--------------------------------"

# 计算总大小
TOTAL_SIZE=$(du -sh dist | cut -f1)
echo "📁 总大小：$TOTAL_SIZE"

# JS 文件
echo ""
echo "📄 JavaScript 文件:"
find dist/assets -name "*.js" -exec ls -lh {} \; | awk '{print "  " $9 ": " $5}' | sort

# CSS 文件
echo ""
echo "🎨 CSS 文件:"
find dist/assets -name "*.css" -exec ls -lh {} \; | awk '{print "  " $9 ": " $5}' | sort

# 其他资源
echo ""
echo "🖼️  其他资源:"
find dist/assets -type f ! -name "*.js" ! -name "*.css" -exec ls -lh {} \; | awk '{print "  " $9 ": " $5}' | sort

echo ""
echo "📈 步骤 4: 详细统计"
echo "--------------------------------"

# JS 总大小
JS_SIZE=$(find dist/assets -name "*.js" -exec cat {} \; | wc -c)
echo "💾 JavaScript 总大小：$(echo "scale=2; $JS_SIZE/1024" | bc) KB"

# CSS 总大小
CSS_SIZE=$(find dist/assets -name "*.css" -exec cat {} \; | wc -c)
echo "🎨 CSS 总大小：$(echo "scale=2; $CSS_SIZE/1024" | bc) KB"

# 文件数量
JS_COUNT=$(find dist/assets -name "*.js" | wc -l)
CSS_COUNT=$(find dist/assets -name "*.css" | wc -l)
echo "📄 JavaScript 文件数：$JS_COUNT"
echo "📄 CSS 文件数：$CSS_COUNT"

echo ""
echo "✅ 性能测试完成!"
echo ""
echo "📝 提示："
echo "  - 使用 Chrome DevTools Lighthouse 测试加载性能"
echo "  - 使用 vite-bundle-visualize 查看详细包分析"
echo "  - 对比优化前后的首屏加载时间"
