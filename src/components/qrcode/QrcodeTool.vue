<template>
  <div class="tool-container">
    <h2>📱 二维码生成</h2>
    <p class="tool-description">将文本、URL 等转换为二维码图片</p>
    
    <n-card class="tool-card">
      <n-space vertical>
        <n-input
          v-model:value="qrText"
          type="textarea"
          placeholder="输入文本或 URL..."
          :rows="3"
          @input="generateQR"
        />
        <div class="qr-container" v-if="qrCodeDataUrl">
          <img :src="qrCodeDataUrl" alt="QR Code" />
        </div>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QRCode from 'qrcode'
import { NCard, NInput, NSpace } from 'naive-ui'

const qrText = ref('')
const qrCodeDataUrl = ref('')

const generateQR = async () => {
  if (!qrText.value) {
    qrCodeDataUrl.value = ''
    return
  }
  try {
    qrCodeDataUrl.value = await QRCode.toDataURL(qrText.value)
  } catch (e) {
    console.error('QR 生成失败', e)
  }
}
</script>

<style scoped>
.tool-container { max-width: 900px; }
h2 { font-size: 24px; margin-bottom: 8px; }
.tool-description { color: var(--text-secondary); margin-bottom: 20px; }
.tool-card { background: var(--bg-secondary); border: 1px solid var(--border); }
.qr-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}
.qr-container img {
  max-width: 300px;
  border: 1px solid var(--border);
  border-radius: 8px;
}
</style>
