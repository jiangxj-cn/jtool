/**
 * 变量名格式转换工具
 */

export type VarFormat = 
  | 'camelCase'      // 驼峰命名
  | 'PascalCase'     // 大驼峰
  | 'snake_case'     // 下划线
  | 'kebab-case'     // 中划线
  | 'CONSTANT_CASE' // 常量命名
  | 'dot.case'       // 点分隔
  | 'space case'     // 空格分隔

/**
 * 解析变量名为单词数组
 */
function parseWords(input: string): string[] {
  // 处理各种分隔符
  let normalized = input
    .replace(/[-_.\s]+/g, ' ')  // 替换分隔符为空格
    .replace(/([a-z])([A-Z])/g, '$1 $2')  // 驼峰拆分
  
  // 按空格分割并过滤空字符串
  return normalized
    .split(/\s+/)
    .map(w => w.toLowerCase())
    .filter(w => w.length > 0)
}

/**
 * 转换为驼峰命名 (camelCase)
 */
export function toCamelCase(input: string): string {
  const words = parseWords(input)
  if (words.length === 0) return ''
  
  return words[0] + words.slice(1)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
}

/**
 * 转换为大驼峰命名 (PascalCase)
 */
export function toPascalCase(input: string): string {
  const words = parseWords(input)
  return words
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
}

/**
 * 转换为下划线命名 (snake_case)
 */
export function toSnakeCase(input: string): string {
  const words = parseWords(input)
  return words.join('_')
}

/**
 * 转换为中划线命名 (kebab-case)
 */
export function toKebabCase(input: string): string {
  const words = parseWords(input)
  return words.join('-')
}

/**
 * 转换为常量命名 (CONSTANT_CASE)
 */
export function toConstantCase(input: string): string {
  const words = parseWords(input)
  return words.map(w => w.toUpperCase()).join('_')
}

/**
 * 转换为点分隔 (dot.case)
 */
export function toDotCase(input: string): string {
  const words = parseWords(input)
  return words.join('.')
}

/**
 * 转换为空格分隔 (space case)
 */
export function toSpaceCase(input: string): string {
  const words = parseWords(input)
  return words.join(' ')
}

/**
 * 通用转换函数
 */
export function convertVarName(input: string, format: VarFormat): string {
  const converters: Record<VarFormat, (input: string) => string> = {
    'camelCase': toCamelCase,
    'PascalCase': toPascalCase,
    'snake_case': toSnakeCase,
    'kebab-case': toKebabCase,
    'CONSTANT_CASE': toConstantCase,
    'dot.case': toDotCase,
    'space case': toSpaceCase,
  }
  
  return converters[format](input)
}

/**
 * 批量转换
 */
export interface VarNameResult {
  original: string
  camelCase: string
  PascalCase: string
  snake_case: string
  kebab_case: string
  CONSTANT_CASE: string
  dot_case: string
  space_case: string
}

export function convertAll(input: string): VarNameResult {
  return {
    original: input,
    camelCase: toCamelCase(input),
    PascalCase: toPascalCase(input),
    snake_case: toSnakeCase(input),
    kebab_case: toKebabCase(input),
    CONSTANT_CASE: toConstantCase(input),
    dot_case: toDotCase(input),
    space_case: toSpaceCase(input),
  }
}
