#!/bin/bash

# JTool 构建监控脚本
# 用法：./monitor-build.sh [tag]

TAG=${1:-v0.1.1}
REPO="jiangxj-cn/jtool"
CHECK_INTERVAL=120  # 2 分钟

echo "🔍 开始监控构建状态"
echo "   仓库：$REPO"
echo "   标签：$TAG"
echo "   检查间隔：${CHECK_INTERVAL}秒"
echo ""

while true; do
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    
    # 获取最新的 workflow run 状态
    RESPONSE=$(curl -s "https://api.github.com/repos/$REPO/actions/runs?branch=main&per_page=5")
    
    # 检查构建状态
    STATUS=$(echo "$RESPONSE" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
    CONCLUSION=$(echo "$RESPONSE" | grep -o '"conclusion":"[^"]*"' | head -1 | cut -d'"' -f4)
    HTML_URL=$(echo "$RESPONSE" | grep -o '"html_url":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    echo "[$TIMESTAMP] 状态：$STATUS, 结论：$CONCLUSION"
    
    if [ "$STATUS" = "completed" ]; then
        if [ "$CONCLUSION" = "success" ]; then
            echo "✅ 构建成功！"
            echo "🔗 查看：$HTML_URL"
            break
        else
            echo "❌ 构建失败：$CONCLUSION"
            echo "🔗 查看：$HTML_URL"
            break
        fi
    fi
    
    sleep $CHECK_INTERVAL
done
