<template>
  <div class="unit-converter-tool">
    <h2>🔄 单位换算</h2>
    
    <!-- 单位类别选择 -->
    <div class="category-section">
      <n-button-group>
        <n-button
          v-for="cat in categories"
          :key="cat.id"
          :type="selectedCategory === cat.id ? 'primary' : 'default'"
          @click="selectCategory(cat.id)"
        >
          {{ cat.icon }} {{ cat.name }}
        </n-button>
      </n-button-group>
    </div>

    <!-- 换算输入区 -->
    <div class="converter-section">
      <div class="converter-row">
        <div class="input-group">
          <n-input-number
            v-model:value="inputValue"
            placeholder="输入数值"
            :min="category === 'temperature' ? -273.15 : undefined"
            :step="1"
            style="width: 100%"
            @update:value="debouncedConvert"
          />
          <n-select
            v-model:value="fromUnit"
            :options="fromUnitOptions"
            @update:value="convert"
          />
        </div>

        <div class="equals-sign">=</div>

        <div class="input-group">
          <n-input-number
            v-model:value="outputValue"
            placeholder="结果"
            readonly
            style="width: 100%"
          />
          <n-select
            v-model:value="toUnit"
            :options="toUnitOptions"
            @update:value="convert"
          />
        </div>
      </div>

      <!-- 换算公式显示 -->
      <div v-if="formula" class="formula-display">
        <n-tag type="success" size="large">{{ formula }}</n-tag>
      </div>
    </div>

    <!-- 常用换算快捷按钮 -->
    <div class="quick-conversions">
      <h3>📌 常用换算</h3>
      <div class="quick-buttons">
        <n-button
          v-for="(preset, index) in commonPresets"
          :key="index"
          size="small"
          quaternary
          @click="applyPreset(preset)"
        >
          {{ preset.label }}
        </n-button>
      </div>
    </div>

    <!-- 单位信息表格 -->
    <div class="unit-info">
      <h3>📊 {{ currentCategoryName }}单位表</h3>
      <n-data-table
        :columns="unitColumns"
        :data="unitTableData"
        :bordered="false"
        size="small"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { 
  NButton, NButtonGroup, NSelect, NInputNumber, 
  NTag, NDataTable, NCard 
} from 'naive-ui'
import {
  getCategories,
  getUnits,
  convert,
  getCommonConversions,
  validateInput,
  type UnitCategory,
  type ConversionResult
} from '@jtool/core'

// 状态
const selectedCategory = ref<UnitCategory>('length')
const inputValue = ref<number>(1)
const outputValue = ref<number>(0)
const fromUnit = ref<string>('')
const toUnit = ref<string>('')
const formula = ref<string>('')

// 获取类别
const categories = getCategories()

// 当前类别名称
const currentCategoryName = computed(() => {
  const cat = categories.find(c => c.id === selectedCategory.value)
  return cat?.name || ''
})

// 单位选项
const fromUnitOptions = computed(() => {
  const units = getUnits(selectedCategory.value)
  return units.map(u => ({
    label: `${u.name} (${u.symbol})`,
    value: u.id
  }))
})

const toUnitOptions = computed(() => {
  const units = getUnits(selectedCategory.value)
  return units.map(u => ({
    label: `${u.name} (${u.symbol})`,
    value: u.id
  }))
})

// 单位表格列
const unitColumns = [
  {
    title: '单位名称',
    key: 'name',
    width: 100
  },
  {
    title: '符号',
    key: 'symbol',
    width: 60
  },
  {
    title: '说明',
    key: 'description',
    ellipsis: true,
    tooltip: true
  }
]

// 单位表格数据
const unitTableData = computed(() => {
  const units = getUnits(selectedCategory.value)
  return units.map(u => ({
    name: u.name,
    symbol: u.symbol,
    description: getUnitDescription(selectedCategory.value, u.id)
  }))
})

// 常用换算预设
const commonPresets = computed(() => {
  return getCommonConversions(selectedCategory.value)
})

// 选择类别
const selectCategory = (category: UnitCategory) => {
  selectedCategory.value = category
  const units = getUnits(category)
  if (units.length >= 2) {
    fromUnit.value = units[0].id
    toUnit.value = units[1].id
  } else if (units.length === 1) {
    fromUnit.value = units[0].id
    toUnit.value = units[0].id
  }
  convert()
}

// 执行换算
const convert = () => {
  if (!fromUnit.value || !toUnit.value) return

  const validation = validateInput(inputValue.value.toString(), selectedCategory.value)
  if (!validation.valid) {
    formula.value = validation.error || ''
    return
  }

  try {
    const result: ConversionResult = convert(
      inputValue.value,
      fromUnit.value,
      toUnit.value,
      selectedCategory.value
    )
    outputValue.value = result.outputValue
    formula.value = result.formula || ''
  } catch (error) {
    console.error('换算错误:', error)
    outputValue.value = 0
    formula.value = '换算错误'
  }
}

// 防抖换算（用于输入框）
let debounceTimer: any
const debouncedConvert = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(convert, 200)
}

// 应用预设
const applyPreset = (preset: { from: string; to: string; value: number }) => {
  fromUnit.value = preset.from
  toUnit.value = preset.to
  inputValue.value = preset.value
  convert()
}

// 获取单位说明
function getUnitDescription(category: UnitCategory, unitId: string): string {
  const descriptions: Record<UnitCategory, Record<string, string>> = {
    length: {
      meter: '国际单位制基本长度单位',
      kilometer: '1000 米',
      centimeter: '1/100 米',
      millimeter: '1/1000 米',
      mile: '英制长度单位，约 1609 米',
      foot: '英制长度单位，约 0.305 米',
      inch: '英制长度单位，约 2.54 厘米'
    },
    weight: {
      gram: '国际单位制基本质量单位',
      kilogram: '1000 克',
      ton: '1000 千克',
      pound: '英制质量单位，约 454 克',
      ounce: '英制质量单位，约 28.35 克'
    },
    temperature: {
      celsius: '摄氏温标，水的冰点 0°C，沸点 100°C',
      fahrenheit: '华氏温标，水的冰点 32°F，沸点 212°F',
      kelvin: '热力学温标，绝对零度 0K'
    },
    area: {
      sqmeter: '国际单位制面积单位',
      sqkilometer: '100 万平方米',
      sqfoot: '英制面积单位，约 0.093 平方米',
      acre: '英制面积单位，约 4047 平方米'
    },
    volume: {
      liter: '常用体积单位，1 立方分米',
      milliliter: '1/1000 升',
      cubicmeter: '1000 升',
      gallon: '英制体积单位，约 3.785 升'
    },
    speed: {
      mps: '国际单位制速度单位',
      kmph: '千米每小时',
      mph: '英里每小时'
    },
    data: {
      byte: '基本存储单位',
      kb: '1024 字节',
      mb: '1024 KB',
      gb: '1024 MB',
      tb: '1024 GB'
    }
  }

  return descriptions[category]?.[unitId] || ''
}

// 监听类别变化
watch(selectedCategory, () => {
  const units = getUnits(selectedCategory.value)
  if (units.length >= 2) {
    fromUnit.value = units[0].id
    toUnit.value = units[1].id
  }
  inputValue.value = 1
  convert()
})

// 初始化
selectCategory('length')
</script>

<style scoped>
.unit-converter-tool {
  max-width: 900px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 24px;
  font-size: 24px;
}

h3 {
  margin: 20px 0 12px;
  font-size: 16px;
  color: var(--text-secondary);
}

.category-section {
  margin-bottom: 24px;
}

.category-section :deep(.n-button-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.category-section :deep(.n-button) {
  flex: 1;
  min-width: 100px;
}

.converter-section {
  margin-bottom: 24px;
}

.converter-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.equals-sign {
  font-size: 32px;
  font-weight: bold;
  color: var(--text-secondary);
  min-width: 40px;
  text-align: center;
}

.formula-display {
  text-align: center;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.formula-display :deep(.n-tag) {
  font-size: 16px;
  padding: 8px 16px;
}

.quick-conversions {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.quick-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-buttons :deep(.n-button) {
  margin: 0;
}

.unit-info {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .converter-row {
    flex-direction: column;
  }

  .equals-sign {
    transform: rotate(90deg);
    margin: 8px 0;
  }

  .category-section :deep(.n-button) {
    min-width: 80px;
    font-size: 14px;
  }
}
</style>
