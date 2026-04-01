/**
 * 进制转换工具
 */

const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

/**
 * 十进制转任意进制（2-62）
 */
export function decimalToBase(num: number | string, base: number): string {
  if (base < 2 || base > 62) {
    throw new Error('进制范围：2-62')
  }
  
  const n = typeof num === 'string' ? parseInt(num, 10) : num
  if (isNaN(n)) {
    throw new Error('无效的数字')
  }
  
  if (n === 0) return '0'
  
  let result = ''
  let negative = n < 0
  let absNum = Math.abs(n)
  
  while (absNum > 0) {
    result = BASE62_CHARS[absNum % base] + result
    absNum = Math.floor(absNum / base)
  }
  
  return negative ? '-' + result : result
}

/**
 * 任意进制转十进制（2-62）
 */
export function baseToDecimal(str: string, base: number): number {
  if (base < 2 || base > 62) {
    throw new Error('进制范围：2-62')
  }
  
  const cleanStr = str.trim()
  const negative = cleanStr.startsWith('-')
  const absStr = negative ? cleanStr.slice(1) : cleanStr
  
  let result = 0
  for (let i = 0; i < absStr.length; i++) {
    const char = absStr[i]
    const value = BASE62_CHARS.indexOf(char)
    if (value === -1 || value >= base) {
      throw new Error(`无效字符：${char}`)
    }
    result = result * base + value
  }
  
  return negative ? -result : result
}

/**
 * 任意进制间转换
 */
export function convertBase(str: string, fromBase: number, toBase: number): string {
  const decimal = baseToDecimal(str, fromBase)
  return decimalToBase(decimal, toBase)
}

/**
 * 常用进制转换
 */
export interface BaseConversionResult {
  binary: string      // 二进制
  octal: string       // 八进制
  decimal: string     // 十进制
  hexadecimal: string // 十六进制
  base32: string      // 32 进制
  base62: string      // 62 进制
}

export function convertAll(input: string, fromBase: number = 10): BaseConversionResult {
  const decimal = baseToDecimal(input, fromBase)
  
  return {
    binary: decimalToBase(decimal, 2),
    octal: decimalToBase(decimal, 8),
    decimal: decimal.toString(),
    hexadecimal: decimalToBase(decimal, 16).toLowerCase(),
    base32: decimalToBase(decimal, 32),
    base62: decimalToBase(decimal, 62),
  }
}
