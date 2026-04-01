<template>
  <div class="uuid-tool">
    <div class="tool-header">
      <h2>🔖 UUID 生成器</h2>
      <p class="tool-description">快速生成 UUID v4 标识符</p>
    </div>

    <div class="tool-content">
      <!-- 数量选择 -->
      <div class="control-panel">
        <n-space vertical>
          <n-text strong>生成数量</n-text>
          <n-space>
            <n-input-number
              v-model:value="count"
              :min="1"
              :max="50"
              placeholder="1-50"
              style="width: 120px"
            />
            <n-button @click="generateUUIDs" type="primary">
              生成
            </n-button>
          </n-space>
        </n-space>
      </div>

      <!-- 快捷按钮 -->
      <div class="quick-actions">
        <n-space>
          <n-button size="small" @click="count = 1">1 个</n-button>
          <n-button size="small" @click="count = 5">5 个</n-button>
          <n-button size="small" @click="count = 10">10 个</n-button>
          <n-button size="small" @click="count = 20">20 个</n-button>
          <n-button size="small" @click="count = 50">50 个</n-button>
        </n-space>
      </div>

      <!-- 输出区域 -->
      <div class="output-section">
        <div class="output-header">
          <n-text strong>📋 结果</n-text>
          <n-space>
            <n-button 
              size="small" 
              @click="copyAll" 
              :disabled="generatedUUIDs.length === 0"
            >
              📋 复制
            </n-button>
            <n-button 
              size="small" 
              @click="clearResults"
            >
              清空
            </n-button>
          </n-space>
        </div>

        <n-input
          v-model:value="outputValue"
          type="textarea"
          placeholder="点击生成按钮..."
          :rows="12"
          readonly
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { generateBatchUUID } from '@jtool/core'
import { useMessage } from 'naive-ui'

const message = useMessage()

const count = ref(1)
const generatedUUIDs = ref<string[]>([])

const outputValue = computed(() => {
  return generatedUUIDs.value.join('\n')
})

const generateUUIDs = () => {
  const result = generateBatchUUID(count.value)
  generatedUUIDs.value = result.uuids
  message.success(`已生成 ${result.count} 个 UUID`)
}

const copyAll = async () => {
  if (generatedUUIDs.value.length === 0) return

  try {
    await navigator.clipboard.writeText(outputValue.value)
    message.success('已复制到剪贴板')
  } catch {
    message.error('复制失败')
  }
}

const clearResults = () => {
  generatedUUIDs.value = []
  message.info('已清空')
}
</script>

<style scoped>
.uuid-tool {
  max-width: 700px;
  margin: 0 auto;
}

.tool-header {
  margin-bottom: 20px;
}

.tool-header h2 {
  font-size: 22px;
  margin-bottom: 6px;
}

.tool-description {
  color: var(--text-secondary);
  font-size: 13px;
}

.tool-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.control-panel,
.output-section {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.quick-actions {
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
</style>
