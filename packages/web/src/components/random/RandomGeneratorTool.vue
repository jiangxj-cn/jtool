<template>
  <div class="random-generator-tool">
    <div class="tool-header">
      <h2>🎲 随机字符生成</h2>
      <p class="tool-description">生成随机字符串、密码和数字，支持批量生成和自定义配置</p>
    </div>

    <div class="tool-content">
      <!-- 类型选择 -->
      <div class="type-selector">
        <n-radio-group v-model:value="generatorType" size="large">
          <n-radio-button value="string">随机字符串</n-radio-button>
          <n-radio-button value="password">随机密码</n-radio-button>
          <n-radio-button value="number">随机数字</n-radio-button>
        </n-radio-group>
      </div>

      <!-- 配置选项 -->
      <div class="config-section">
        <!-- 长度配置 -->
        <div class="config-item">
          <n-space vertical :size="8">
            <n-text strong>长度</n-text>
            <n-input-number
              v-model:value="length"
              :min="1"
              :max="100"
              :step="1"
              style="width: 100%"
              placeholder="输入长度"
            />
            <n-slider
              v-model:value="length"
              :min="1"
              :max="100"
              :step="1"
              :marks="{
                1: '1',
                8: '8',
                16: '16',
                32: '32',
                64: '64',
                100: '100'
              }"
            />
          </n-space>
        </div>

        <!-- 密码配置 -->
        <div v-if="generatorType === 'password'" class="config-item">
          <n-space vertical :size="12">
            <n-text strong>字符集</n-text>
            <n-checkbox v-model:checked="passwordOptions.includeLowercase">小写字母 (a-z)</n-checkbox>
            <n-checkbox v-model:checked="passwordOptions.includeUppercase">大写字母 (A-Z)</n-checkbox>
            <n-checkbox v-model:checked="passwordOptions.includeNumbers">数字 (0-9)</n-checkbox>
            <n-checkbox v-model:checked="passwordOptions.includeSymbols">特殊符号 (!@#$...)</n-checkbox>
            <n-checkbox v-model:checked="passwordOptions.excludeAmbiguous">排除易混淆字符 (l, I, 1, L, o, O, 0)</n-checkbox>
          </n-space>
        </div>

        <!-- 字符串字符集 -->
        <div v-if="generatorType === 'string'" class="config-item">
          <n-space vertical :size="8">
            <n-text strong>字符集</n-text>
            <n-select
              v-model:value="charSet"
              :options="charSetOptions"
              style="width: 100%"
            />
          </n-space>
        </div>

        <!-- 数字配置 -->
        <div v-if="generatorType === 'number'" class="config-item">
          <n-space vertical :size="12">
            <n-text strong>数字选项</n-text>
            <n-checkbox v-model:checked="includeLeadingZero">允许前导零</n-checkbox>
          </n-space>
        </div>

        <!-- 批量生成 -->
        <div class="config-item">
          <n-space vertical :size="8">
            <n-text strong>批量生成</n-text>
            <n-checkbox v-model:checked="enableBatch">启用批量生成</n-checkbox>
            <n-input-number
              v-if="enableBatch"
              v-model:value="batchCount"
              :min="1"
              :max="100"
              :step="1"
              style="width: 100%"
              placeholder="生成数量"
            />
          </n-space>
        </div>
      </div>

      <!-- 生成按钮 -->
      <div class="action-section">
        <n-button type="primary" size="large" @click="generate" :loading="isGenerating">
          🎲 生成{{ enableBatch ? ` (${batchCount}个)` : '' }}
        </n-button>
      </div>

      <!-- 结果区域 -->
      <div class="result-section">
        <div class="result-header">
          <n-space>
            <n-text strong>生成结果</n-text>
            <n-tag v-if="results.length > 0" type="success" size="small" :bordered="false">
              {{ results.length }} 个结果
            </n-tag>
          </n-space>
          <n-space>
            <n-button size="small" @click="copyAll" :disabled="results.length === 0">复制全部</n-button>
            <n-button size="small" @click="clearResults" :disabled="results.length === 0">清空</n-button>
          </n-space>
        </div>

        <div v-if="results.length === 0" class="empty-result">
          <n-text depth="3">点击生成按钮创建随机字符...</n-text>
        </div>

        <div v-else class="results-list">
          <div
            v-for="(result, index) in results"
            :key="index"
            class="result-item"
          >
            <div class="result-value">
              <n-text>{{ result.value }}</n-text>
            </div>
            <div class="result-actions">
              <n-button size="small" quaternary @click="copySingle(result.value)">
                📋 复制
              </n-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div v-if="results.length > 0" class="stats-section">
        <n-grid :cols="4" :x-gap="12">
          <n-statistic label="生成数量">
            <template #prefix>📊</template>
            {{ results.length }}
          </n-statistic>
          <n-statistic label="平均长度">
            <template #prefix>📏</template>
            {{ averageLength }}
          </n-statistic>
          <n-statistic label="类型">
            <template #prefix>🏷️</template>
            {{ getTypeLabel }}
          </n-statistic>
          <n-statistic label="生成时间">
            <template #prefix>⏱️</template>
            {{ generationTime }}ms
          </n-statistic>
        </n-grid>
      </div>

      <!-- 快速示例 -->
      <div class="examples-section">
        <n-text depth="3" style="font-size: 12px">💡 快速生成：</n-text>
        <n-space style="margin-top: 8px">
          <n-button size="small" secondary @click="quickGenerate('uuid')">UUID (16 位)</n-button>
          <n-button size="small" secondary @click="quickGenerate('strong')">强密码 (16 位)</n-button>
          <n-button size="small" secondary @click="quickGenerate('simple')">简单密码 (8 位)</n-button>
          <n-button size="small" secondary @click="quickGenerate('otp')">OTP 验证码 (6 位)</n-button>
        </n-space>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import {
  NRadioGroup, NRadioButton, NInputNumber, NSlider, NCheckbox,
  NSelect, NButton, NSpace, NText, NTag, NGrid, NStatistic,
  useMessage
} from 'naive-ui'
import {
  generateRandomString, generateRandomPassword, generateRandomNumber,
  type CharacterSet, type PasswordOptions
} from '@jtool/core'

const message = useMessage()

// 状态
const generatorType = ref<'string' | 'password' | 'number'>('password')
const length = ref(16)
const charSet = ref<CharacterSet>('mixed')
const includeLeadingZero = ref(false)
const enableBatch = ref(false)
const batchCount = ref(5)
const isGenerating = ref(false)
const generationTime = ref(0)

const passwordOptions = ref<Partial<PasswordOptions>>({
  includeLowercase: true,
  includeUppercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeAmbiguous: false,
})

const results = ref<Array<{ value: string; type: string }>>([])

// 字符集选项
const charSetOptions = [
  { label: '混合 (字母 + 数字 + 符号)', value: 'mixed' },
  { label: '仅小写字母', value: 'lowercase' },
  { label: '仅大写字母', value: 'uppercase' },
  { label: '仅数字', value: 'numbers' },
  { label: '仅符号', value: 'symbols' },
]

// 获取类型标签
const getTypeLabel = computed(() => {
  const labels = {
    string: '字符串',
    password: '密码',
    number: '数字',
  }
  return labels[generatorType.value]
})

// 计算平均长度
const averageLength = computed(() => {
  if (results.value.length === 0) return 0
  const total = results.value.reduce((sum, r) => sum + r.value.length, 0)
  return Math.round(total / results.value.length)
})

// 生成随机字符
const generate = () => {
  isGenerating.value = true
  const startTime = Date.now()

  try {
    let value: string
    
    if (enableBatch.value) {
      // 批量生成
      const batchResults: string[] = []
      for (let i = 0; i < batchCount.value; i++) {
        if (generatorType.value === 'string') {
          value = generateRandomString(length.value, charSet.value)
        } else if (generatorType.value === 'password') {
          value = generateRandomPassword({
            length: length.value,
            ...passwordOptions.value,
          })
        } else {
          value = generateRandomNumber(length.value, includeLeadingZero.value)
        }
        batchResults.push(value)
        console.log(`[RandomGenerator] 第${i+1}个结果:`, value)
      }
      // 强制响应式更新
      results.value = []
      nextTick(() => {
        results.value = batchResults.map(v => ({ value: v, type: generatorType.value }))
        console.log('[RandomGenerator] 批量结果已设置:', results.value.length, '个')
      })
    } else {
      // 单个生成
      if (generatorType.value === 'string') {
        value = generateRandomString(length.value, charSet.value)
      } else if (generatorType.value === 'password') {
        value = generateRandomPassword({
          length: length.value,
          ...passwordOptions.value,
        })
      } else {
        value = generateRandomNumber(length.value, includeLeadingZero.value)
      }
      console.log('[RandomGenerator] 生成结果:', value)
      // 强制响应式更新
      results.value = []
      nextTick(() => {
        results.value = [{ value, type: generatorType.value }]
        console.log('[RandomGenerator] 单个结果已设置')
      })
    }

    generationTime.value = Date.now() - startTime
    message.success(`生成成功，${enableBatch.value ? batchCount.value : 1} 个结果`)
  } catch (error) {
    console.error('[RandomGenerator] 生成失败:', error)
    message.error(error instanceof Error ? error.message : '生成失败')
    results.value = []
  } finally {
    isGenerating.value = false
  }
}

// 快速生成预设
const quickGenerate = (preset: string) => {
  switch (preset) {
    case 'uuid':
      generatorType.value = 'string'
      length.value = 16
      charSet.value = 'mixed'
      enableBatch.value = false
      break
    case 'strong':
      generatorType.value = 'password'
      length.value = 16
      passwordOptions.value = {
        includeLowercase: true,
        includeUppercase: true,
        includeNumbers: true,
        includeSymbols: true,
        excludeAmbiguous: false,
      }
      enableBatch.value = false
      break
    case 'simple':
      generatorType.value = 'password'
      length.value = 8
      passwordOptions.value = {
        includeLowercase: true,
        includeUppercase: true,
        includeNumbers: true,
        includeSymbols: false,
        excludeAmbiguous: false,
      }
      enableBatch.value = false
      break
    case 'otp':
      generatorType.value = 'number'
      length.value = 6
      includeLeadingZero.value = true
      enableBatch.value = false
      break
  }
  generate()
}

// 复制单个结果
const copySingle = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    message.success('已复制')
  } catch (error) {
    message.error('复制失败')
  }
}

// 复制全部结果
const copyAll = async () => {
  const allText = results.value.map(r => r.value).join('\n')
  try {
    await navigator.clipboard.writeText(allText)
    message.success('已复制全部结果')
  } catch (error) {
    message.error('复制失败')
  }
}

// 清空结果
const clearResults = () => {
  results.value = []
  message.success('已清空')
}
</script>

<style scoped>
.random-generator-tool {
  max-width: 900px;
  margin: 0 auto;
}

.tool-header {
  margin-bottom: 24px;
}

.tool-header h2 {
  font-size: 24px;
  margin-bottom: 8px;
}

.tool-description {
  color: var(--text-secondary);
  font-size: 14px;
}

.tool-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.type-selector {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.config-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.config-item {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.action-section {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  text-align: center;
}

.result-section {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.empty-result {
  text-align: center;
  padding: 40px 20px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--bg-primary);
  border-radius: 6px;
  border: 1px solid var(--border);
}

.result-value {
  flex: 1;
  margin-right: 16px;
  overflow: hidden;
}

.result-value :deep(.n-code) {
  word-break: break-all;
  font-size: 13px;
}

.result-actions {
  flex-shrink: 0;
}

.stats-section {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.examples-section {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

:deep(.n-statistic) {
  --n-label-font-size: 12px;
  --n-value-font-size: 18px;
}

:deep(.n-code) {
  background: var(--bg-primary);
  padding: 8px 12px;
  border-radius: 4px;
}

/* 响应式 */
@media (max-width: 768px) {
  .config-section {
    grid-template-columns: 1fr;
  }

  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .result-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .result-actions {
    width: 100%;
    text-align: right;
  }
}
</style>
