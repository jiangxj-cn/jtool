/**
 * 单位换算工具
 * 支持长度、重量、温度、面积、体积、速度、数据存储等单位换算
 */

/**
 * 单位类别枚举
 */
export type UnitCategory = 
  | 'length'
  | 'weight'
  | 'temperature'
  | 'area'
  | 'volume'
  | 'speed'
  | 'data'

/**
 * 单位定义接口
 */
export interface UnitDefinition {
  id: string
  name: string
  symbol: string
  // 转换为基准单位的系数（温度除外）
  toBase?: number
  // 从基准单位转换的系数（温度除外）
  fromBase?: number
  // 温度转换特殊处理
  toBaseFn?: (value: number) => number
  fromBaseFn?: (value: number) => number
}

/**
 * 单位换算结果接口
 */
export interface ConversionResult {
  inputValue: number
  inputUnit: string
  outputValue: number
  outputUnit: string
  category: UnitCategory
  formula?: string
}

/**
 * 所有单位定义
 */
export const unitDefinitions: Record<UnitCategory, UnitDefinition[]> = {
  // 长度单位（基准：米）
  length: [
    { id: 'meter', name: '米', symbol: 'm', toBase: 1, fromBase: 1 },
    { id: 'kilometer', name: '千米', symbol: 'km', toBase: 1000, fromBase: 0.001 },
    { id: 'centimeter', name: '厘米', symbol: 'cm', toBase: 0.01, fromBase: 100 },
    { id: 'millimeter', name: '毫米', symbol: 'mm', toBase: 0.001, fromBase: 1000 },
    { id: 'mile', name: '英里', symbol: 'mi', toBase: 1609.344, fromBase: 1 / 1609.344 },
    { id: 'foot', name: '英尺', symbol: 'ft', toBase: 0.3048, fromBase: 1 / 0.3048 },
    { id: 'inch', name: '英寸', symbol: 'in', toBase: 0.0254, fromBase: 1 / 0.0254 },
  ],

  // 重量单位（基准：克）
  weight: [
    { id: 'gram', name: '克', symbol: 'g', toBase: 1, fromBase: 1 },
    { id: 'kilogram', name: '千克', symbol: 'kg', toBase: 1000, fromBase: 0.001 },
    { id: 'ton', name: '吨', symbol: 't', toBase: 1000000, fromBase: 0.000001 },
    { id: 'pound', name: '磅', symbol: 'lb', toBase: 453.59237, fromBase: 1 / 453.59237 },
    { id: 'ounce', name: '盎司', symbol: 'oz', toBase: 28.349523125, fromBase: 1 / 28.349523125 },
  ],

  // 温度单位（特殊处理）
  temperature: [
    { 
      id: 'celsius', 
      name: '摄氏度', 
      symbol: '°C',
      toBaseFn: (v) => v,
      fromBaseFn: (v) => v
    },
    { 
      id: 'fahrenheit', 
      name: '华氏度', 
      symbol: '°F',
      toBaseFn: (v) => (v - 32) * 5 / 9,
      fromBaseFn: (v) => v * 9 / 5 + 32
    },
    { 
      id: 'kelvin', 
      name: '开尔文', 
      symbol: 'K',
      toBaseFn: (v) => v - 273.15,
      fromBaseFn: (v) => v + 273.15
    },
  ],

  // 面积单位（基准：平方米）
  area: [
    { id: 'sqmeter', name: '平方米', symbol: 'm²', toBase: 1, fromBase: 1 },
    { id: 'sqkilometer', name: '平方千米', symbol: 'km²', toBase: 1000000, fromBase: 0.000001 },
    { id: 'sqfoot', name: '平方英尺', symbol: 'ft²', toBase: 0.09290304, fromBase: 1 / 0.09290304 },
    { id: 'acre', name: '英亩', symbol: 'ac', toBase: 4046.8564224, fromBase: 1 / 4046.8564224 },
  ],

  // 体积单位（基准：升）
  volume: [
    { id: 'liter', name: '升', symbol: 'L', toBase: 1, fromBase: 1 },
    { id: 'milliliter', name: '毫升', symbol: 'mL', toBase: 0.001, fromBase: 1000 },
    { id: 'cubicmeter', name: '立方米', symbol: 'm³', toBase: 1000, fromBase: 0.001 },
    { id: 'gallon', name: '加仑', symbol: 'gal', toBase: 3.785411784, fromBase: 1 / 3.785411784 },
  ],

  // 速度单位（基准：米/秒）
  speed: [
    { id: 'mps', name: '米/秒', symbol: 'm/s', toBase: 1, fromBase: 1 },
    { id: 'kmph', name: '千米/小时', symbol: 'km/h', toBase: 1 / 3.6, fromBase: 3.6 },
    { id: 'mph', name: '英里/小时', symbol: 'mph', toBase: 0.44704, fromBase: 1 / 0.44704 },
  ],

  // 数据存储单位（基准：字节）
  data: [
    { id: 'byte', name: '字节', symbol: 'B', toBase: 1, fromBase: 1 },
    { id: 'kb', name: 'KB', symbol: 'KB', toBase: 1024, fromBase: 1 / 1024 },
    { id: 'mb', name: 'MB', symbol: 'MB', toBase: 1048576, fromBase: 1 / 1048576 },
    { id: 'gb', name: 'GB', symbol: 'GB', toBase: 1073741824, fromBase: 1 / 1073741824 },
    { id: 'tb', name: 'TB', symbol: 'TB', toBase: 1099511627776, fromBase: 1 / 1099511627776 },
  ],
}

/**
 * 获取指定类别的所有单位
 */
export function getUnits(category: UnitCategory): UnitDefinition[] {
  return unitDefinitions[category]
}

/**
 * 获取所有单位类别
 */
export function getCategories(): { id: UnitCategory; name: string; icon: string }[] {
  return [
    { id: 'length', name: '长度', icon: '📏' },
    { id: 'weight', name: '重量', icon: '⚖️' },
    { id: 'temperature', name: '温度', icon: '🌡️' },
    { id: 'area', name: '面积', icon: '📐' },
    { id: 'volume', name: '体积', icon: '🧪' },
    { id: 'speed', name: '速度', icon: '⚡' },
    { id: 'data', name: '数据存储', icon: '💾' },
  ]
}

/**
 * 根据单位 ID 查找单位定义
 */
export function findUnit(category: UnitCategory, unitId: string): UnitDefinition | undefined {
  const units = unitDefinitions[category].filter(u => u.id === unitId)
  return units.length > 0 ? units[0] : undefined
}

/**
 * 执行单位换算
 */
export function convert(
  value: number,
  fromUnitId: string,
  toUnitId: string,
  category: UnitCategory
): ConversionResult {
  const fromUnit = findUnit(category, fromUnitId)
  const toUnit = findUnit(category, toUnitId)

  if (!fromUnit || !toUnit) {
    throw new Error('无效的单位')
  }

  if (fromUnitId === toUnitId) {
    return {
      inputValue: value,
      inputUnit: fromUnit.symbol,
      outputValue: value,
      outputUnit: toUnit.symbol,
      category,
      formula: `${value} ${fromUnit.symbol} = ${value} ${toUnit.symbol}`
    }
  }

  let baseValue: number

  // 温度单位特殊处理
  if (category === 'temperature') {
    if (!fromUnit.toBaseFn || !toUnit.fromBaseFn) {
      throw new Error('温度单位转换函数未定义')
    }
    baseValue = fromUnit.toBaseFn(value)
  } else {
    // 其他单位使用系数转换
    if (!fromUnit.toBase || !toUnit.fromBase) {
      throw new Error('单位转换系数未定义')
    }
    baseValue = value * fromUnit.toBase
  }

  const result = toUnit.fromBaseFn 
    ? toUnit.fromBaseFn(baseValue)
    : baseValue * toUnit.fromBase!

  // 格式化结果（避免浮点数精度问题）
  const formattedResult = formatResult(result)

  return {
    inputValue: value,
    inputUnit: fromUnit.symbol,
    outputValue: formattedResult,
    outputUnit: toUnit.symbol,
    category,
    formula: `${value} ${fromUnit.symbol} = ${formattedResult} ${toUnit.symbol}`
  }
}

/**
 * 格式化结果，避免浮点数精度问题
 */
function formatResult(value: number): number {
  // 如果是非常小或非常大的数，使用科学计数法
  if (Math.abs(value) < 1e-10 || Math.abs(value) > 1e15) {
    return parseFloat(value.toExponential(6))
  }
  
  // 否则保留最多 10 位小数，然后去除末尾的零
  const rounded = Math.round(value * 1e10) / 1e10
  return rounded
}

/**
 * 获取常用换算预设
 */
export function getCommonConversions(category: UnitCategory): Array<{
  from: string
  to: string
  value: number
  label: string
}> {
  const presets: Record<UnitCategory, Array<{ from: string; to: string; value: number; label: string }>> = {
    length: [
      { from: 'meter', to: 'centimeter', value: 1, label: '1 米 = ? 厘米' },
      { from: 'kilometer', to: 'mile', value: 1, label: '1 千米 = ? 英里' },
      { from: 'foot', to: 'inch', value: 1, label: '1 英尺 = ? 英寸' },
    ],
    weight: [
      { from: 'kilogram', to: 'pound', value: 1, label: '1 千克 = ? 磅' },
      { from: 'ton', to: 'kilogram', value: 1, label: '1 吨 = ? 千克' },
    ],
    temperature: [
      { from: 'celsius', to: 'fahrenheit', value: 0, label: '0°C = ?°F' },
      { from: 'celsius', to: 'fahrenheit', value: 100, label: '100°C = ?°F' },
      { from: 'fahrenheit', to: 'celsius', value: 32, label: '32°F = ?°C' },
    ],
    area: [
      { from: 'sqmeter', to: 'sqfoot', value: 1, label: '1 平方米 = ? 平方英尺' },
      { from: 'acre', to: 'sqmeter', value: 1, label: '1 英亩 = ? 平方米' },
    ],
    volume: [
      { from: 'liter', to: 'gallon', value: 1, label: '1 升 = ? 加仑' },
      { from: 'cubicmeter', to: 'liter', value: 1, label: '1 立方米 = ? 升' },
    ],
    speed: [
      { from: 'mps', to: 'kmph', value: 1, label: '1 米/秒 = ? 千米/小时' },
      { from: 'kmph', to: 'mph', value: 100, label: '100 km/h = ? mph' },
    ],
    data: [
      { from: 'gb', to: 'mb', value: 1, label: '1 GB = ? MB' },
      { from: 'tb', to: 'gb', value: 1, label: '1 TB = ? GB' },
    ],
  }

  return presets[category] || []
}

/**
 * 验证输入值
 */
export function validateInput(value: string, category: UnitCategory): { valid: boolean; error?: string } {
  const numValue = parseFloat(value)
  
  if (isNaN(numValue)) {
    return { valid: false, error: '请输入有效的数字' }
  }

  // 温度特殊处理：开尔文不能低于绝对零度
  if (category === 'temperature') {
    if (numValue < -273.15) {
      return { valid: false, error: '温度不能低于绝对零度（-273.15°C）' }
    }
  }

  // 其他单位不能为负数
  if (numValue < 0 && category !== 'temperature') {
    return { valid: false, error: '值不能为负数' }
  }

  return { valid: true }
}
