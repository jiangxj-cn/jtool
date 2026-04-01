/**
 * 随机字符生成工具
 * 支持随机字符串、密码、数字生成，支持批量生成
 */

export type CharacterSet = 'lowercase' | 'uppercase' | 'numbers' | 'symbols' | 'mixed'

export interface PasswordOptions {
  length: number
  includeLowercase: boolean
  includeUppercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeAmbiguous: boolean // 排除易混淆字符 (l, I, 1, L, o, O, 0)
}

export interface RandomResult {
  value: string
  type: 'string' | 'password' | 'number'
  length: number
  timestamp: number
}

export interface BatchRandomResult {
  results: RandomResult[]
  count: number
  type: 'string' | 'password' | 'number'
}

const CHAR_SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

const AMBIGUOUS_CHARS = ['l', 'I', '1', 'L', 'o', 'O', '0']

/**
 * 获取字符集
 */
function getCharacterSet(charSet: CharacterSet): string {
  switch (charSet) {
    case 'lowercase':
      return CHAR_SETS.lowercase
    case 'uppercase':
      return CHAR_SETS.uppercase
    case 'numbers':
      return CHAR_SETS.numbers
    case 'symbols':
      return CHAR_SETS.symbols
    case 'mixed':
      return CHAR_SETS.lowercase + CHAR_SETS.uppercase + CHAR_SETS.numbers + CHAR_SETS.symbols
    default:
      return CHAR_SETS.lowercase + CHAR_SETS.uppercase + CHAR_SETS.numbers
  }
}

/**
 * 构建密码字符集
 */
function buildPasswordCharset(options: PasswordOptions): string {
  let charset = ''
  
  if (options.includeLowercase) {
    charset += CHAR_SETS.lowercase
  }
  if (options.includeUppercase) {
    charset += CHAR_SETS.uppercase
  }
  if (options.includeNumbers) {
    charset += CHAR_SETS.numbers
  }
  if (options.includeSymbols) {
    charset += CHAR_SETS.symbols
  }

  if (options.excludeAmbiguous) {
    charset = charset.split('').filter(char => !AMBIGUOUS_CHARS.includes(char)).join('')
  }

  if (charset.length === 0) {
    throw new Error('至少需要选择一个字符集')
  }

  return charset
}

/**
 * 生成随机字符
 */
function getRandomChar(charset: string): string {
  const index = Math.floor(Math.random() * charset.length)
  return charset[index]
}

/**
 * 生成随机字符串
 * @param length 字符串长度
 * @param charSet 字符集类型
 */
export function generateRandomString(length: number = 16, charSet: CharacterSet = 'mixed'): string {
  if (length <= 0) {
    throw new Error('长度必须大于 0')
  }
  
  const charset = getCharacterSet(charSet)
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += getRandomChar(charset)
  }
  
  return result
}

/**
 * 生成随机密码
 * @param options 密码选项
 */
export function generateRandomPassword(options: Partial<PasswordOptions> = {}): string {
  const finalOptions: PasswordOptions = {
    length: options.length || 16,
    includeLowercase: options.includeLowercase ?? true,
    includeUppercase: options.includeUppercase ?? true,
    includeNumbers: options.includeNumbers ?? true,
    includeSymbols: options.includeSymbols ?? true,
    excludeAmbiguous: options.excludeAmbiguous ?? false,
  }

  if (finalOptions.length <= 0) {
    throw new Error('密码长度必须大于 0')
  }

  const charset = buildPasswordCharset(finalOptions)
  let password = ''

  // 确保至少包含每种选中的字符类型
  const requiredChars: string[] = []
  if (finalOptions.includeLowercase) {
    requiredChars.push(getRandomChar(CHAR_SETS.lowercase))
  }
  if (finalOptions.includeUppercase) {
    requiredChars.push(getRandomChar(CHAR_SETS.uppercase))
  }
  if (finalOptions.includeNumbers) {
    requiredChars.push(getRandomChar(CHAR_SETS.numbers))
  }
  if (finalOptions.includeSymbols) {
    requiredChars.push(getRandomChar(CHAR_SETS.symbols))
  }

  // 填充剩余字符
  for (let i = requiredChars.length; i < finalOptions.length; i++) {
    password += getRandomChar(charset)
  }

  // 添加必需字符并打乱
  const allChars = (password + requiredChars.join('')).split('')
  for (let i = allChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[allChars[i], allChars[j]] = [allChars[j], allChars[i]]
  }

  return allChars.join('')
}

/**
 * 生成随机数字
 * @param length 数字位数
 * @param includeLeadingZero 是否允许前导零
 */
export function generateRandomNumber(length: number = 6, includeLeadingZero: boolean = false): string {
  if (length <= 0) {
    throw new Error('长度必须大于 0')
  }
  
  if (length > 15) {
    throw new Error('长度不能超过 15 位（避免精度丢失）')
  }

  let result = ''
  
  // 第一位不能是 0（除非允许前导零）
  if (!includeLeadingZero) {
    result += getRandomChar('123456789')
    for (let i = 1; i < length; i++) {
      result += getRandomChar(CHAR_SETS.numbers)
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += getRandomChar(CHAR_SETS.numbers)
    }
  }
  
  return result
}

/**
 * 批量生成随机字符串
 */
export function batchGenerateRandomString(
  count: number,
  length: number = 16,
  charSet: CharacterSet = 'mixed'
): RandomResult[] {
  if (count <= 0) {
    throw new Error('数量必须大于 0')
  }
  
  const results: RandomResult[] = []
  const timestamp = Date.now()
  
  for (let i = 0; i < count; i++) {
    results.push({
      value: generateRandomString(length, charSet),
      type: 'string',
      length,
      timestamp,
    })
  }
  
  return results
}

/**
 * 批量生成随机密码
 */
export function batchGenerateRandomPassword(
  count: number,
  options: Partial<PasswordOptions> = {}
): RandomResult[] {
  if (count <= 0) {
    throw new Error('数量必须大于 0')
  }
  
  const results: RandomResult[] = []
  const timestamp = Date.now()
  const finalOptions: PasswordOptions = {
    length: options.length || 16,
    includeLowercase: options.includeLowercase ?? true,
    includeUppercase: options.includeUppercase ?? true,
    includeNumbers: options.includeNumbers ?? true,
    includeSymbols: options.includeSymbols ?? true,
    excludeAmbiguous: options.excludeAmbiguous ?? false,
  }
  
  for (let i = 0; i < count; i++) {
    results.push({
      value: generateRandomPassword(options),
      type: 'password',
      length: finalOptions.length,
      timestamp,
    })
  }
  
  return results
}

/**
 * 批量生成随机数字
 */
export function batchGenerateRandomNumber(
  count: number,
  length: number = 6,
  includeLeadingZero: boolean = false
): RandomResult[] {
  if (count <= 0) {
    throw new Error('数量必须大于 0')
  }
  
  const results: RandomResult[] = []
  const timestamp = Date.now()
  
  for (let i = 0; i < count; i++) {
    results.push({
      value: generateRandomNumber(length, includeLeadingZero),
      type: 'number',
      length,
      timestamp,
    })
  }
  
  return results
}

/**
 * 生成单个随机结果
 */
export function generateRandom(
  type: 'string' | 'password' | 'number',
  options?: {
    length?: number
    charSet?: CharacterSet
    passwordOptions?: Partial<PasswordOptions>
    includeLeadingZero?: boolean
  }
): RandomResult {
  let value: string
  let length: number

  switch (type) {
    case 'string':
      length = options?.length || 16
      value = generateRandomString(length, options?.charSet || 'mixed')
      break
    case 'password':
      length = options?.passwordOptions?.length || 16
      value = generateRandomPassword(options?.passwordOptions)
      break
    case 'number':
      length = options?.length || 6
      value = generateRandomNumber(length, options?.includeLeadingZero)
      break
    default:
      throw new Error('不支持的类型')
  }

  return {
    value,
    type,
    length,
    timestamp: Date.now(),
  }
}

/**
 * 批量生成
 */
export function batchGenerate(
  type: 'string' | 'password' | 'number',
  count: number,
  options?: {
    length?: number
    charSet?: CharacterSet
    passwordOptions?: Partial<PasswordOptions>
    includeLeadingZero?: boolean
  }
): BatchRandomResult {
  let results: RandomResult[]

  switch (type) {
    case 'string':
      results = batchGenerateRandomString(count, options?.length || 16, options?.charSet || 'mixed')
      break
    case 'password':
      results = batchGenerateRandomPassword(count, options?.passwordOptions)
      break
    case 'number':
      results = batchGenerateRandomNumber(count, options?.length || 6, options?.includeLeadingZero)
      break
    default:
      throw new Error('不支持的类型')
  }

  return {
    results,
    count,
    type,
  }
}
