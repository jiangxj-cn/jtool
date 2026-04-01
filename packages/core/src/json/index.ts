/**
 * JSON 工具
 */
import JSON5 from 'json5'

export interface JsonResult {
  success: boolean
  result?: string
  error?: string
}

/**
 * JSON 格式化
 */
export function jsonFormat(input: string, space: number = 2): JsonResult {
  try {
    const obj = JSON5.parse(input)
    return {
      success: true,
      result: JSON.stringify(obj, null, space),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '无效的 JSON',
    }
  }
}

/**
 * JSON 校验
 */
export function jsonValidate(input: string): { valid: boolean; error?: string } {
  try {
    JSON5.parse(input)
    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : '无效的 JSON',
    }
  }
}

/**
 * JSON 压缩
 */
export function jsonMinify(input: string): JsonResult {
  try {
    const obj = JSON5.parse(input)
    return {
      success: true,
      result: JSON.stringify(obj),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '无效的 JSON',
    }
  }
}

/**
 * JSON 转义
 */
export function jsonEscape(input: string): string {
  return JSON.stringify(input)
}

/**
 * JSON 去除转义
 */
export function jsonUnescape(input: string): string {
  try {
    return JSON.parse(input)
  } catch {
    return input
  }
}
