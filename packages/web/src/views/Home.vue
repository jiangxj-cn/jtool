<template>
  <div class="home-container">
    <h2>🛠️ 欢迎使用 JTool</h2>
    <p class="description">选择一个工具开始使用</p>
    
    <div class="tools-grid">
      <div
        v-for="tool in tools"
        :key="tool.path"
        class="tool-card"
        @click="navigateTo(tool.path)"
      >
        <div class="tool-icon">{{ tool.icon }}</div>
        <div class="tool-name">{{ tool.name }}</div>
        <div class="tool-desc">{{ tool.desc }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const tools = [
  { path: '/json', icon: '📝', name: 'JSON', desc: '格式化、验证、转换' },
  { path: '/base64', icon: '🔐', name: 'Base64', desc: '编码解码' },
  { path: '/url', icon: '🔗', name: 'URL', desc: '编码解码、解析' },
  { path: '/hash', icon: '📐', name: '哈希计算', desc: 'MD5, SHA, HMAC' },
  { path: '/timestamp', icon: '🕐', name: '时间戳', desc: '转换、时区' },
  { path: '/qrcode', icon: '📱', name: '二维码', desc: '生成、解析' },
  { path: '/text', icon: '📄', name: '文本', desc: '统计、处理' },
  { path: '/regex', icon: '🔍', name: '正则测试', desc: '匹配、高亮' },
  { path: '/jwt', icon: '🔑', name: 'JWT', desc: '解码、验证' },
  { path: '/ipcalculator', icon: '🌐', name: 'IP 计算器', desc: '子网计算' },
  { path: '/ascii', icon: '🔢', name: 'ASCII', desc: '编码转换' },
  { path: '/uuid', icon: '🔖', name: 'UUID', desc: '生成唯一标识' },
  { path: '/random', icon: '🎲', name: '随机字符', desc: '密码生成' },
  { path: '/unitconverter', icon: '🔄', name: '单位换算', desc: '长度、重量等' },
]

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  font-size: 28px;
  margin-bottom: 8px;
}

.description {
  color: var(--text-secondary);
  margin-bottom: 30px;
  font-size: 16px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.tool-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.tool-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.tool-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.tool-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.tool-desc {
  font-size: 13px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .tools-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
  
  .tool-icon {
    font-size: 36px;
  }
}
</style>
