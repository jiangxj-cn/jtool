/**
 * JSON 格式化、校验、压缩
 */
import JSON5 from 'json5'
import type { JsonResult } from './index'

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
