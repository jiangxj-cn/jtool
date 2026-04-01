/**
 * JSON 转义基础功能
 */
import JSON5 from 'json5'

/**
 * JSON 转义（字符串转 JSON 字符串）
 */
export function jsonEscape(input: string): string {
  return JSON.stringify(input)
}

/**
 * JSON 去除转义（JSON 字符串转普通字符串）
 */
export function jsonUnescape(input: string): string {
  try {
    return JSON.parse(input)
  } catch {
    return input
  }
}

/**
 * JSON 对象转义（添加转义符）
 */
export function jsonEscapeObject(input: string): string {
  try {
    const obj = JSON5.parse(input)
    return JSON.stringify(obj)
  } catch (error) {
    throw new Error('无效的 JSON 输入')
  }
}

/**
 * JSON 对象去除转义（移除转义符）
 */
export function jsonUnescapeObject(input: string): string {
  try {
    const obj = JSON.parse(input)
    return JSON5.stringify(obj, null, 2)
  } catch (error) {
    throw new Error('无效的 JSON 输入')
  }
}

/**
 * JSON 转义所有特殊字符
 */
export function jsonEscapeAll(input: string): string {
  return input
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
}

/**
 * JSON 去除所有转义
 */
export function jsonUnescapeAll(input: string): string {
  return input
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\\t')
    .replace(/\\\\/g, '\\')
}
