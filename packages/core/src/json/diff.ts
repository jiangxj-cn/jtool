/**
 * JSON 比较功能
 */
import JSON5 from 'json5'
import { createTwoFilesPatch } from 'diff'
import { diff as jsonDiff } from 'jsondiffpatch'
import type { JsonResult } from './index'

export interface DiffResult extends JsonResult {
  diff?: string
  hasChanges?: boolean
}

/**
 * 比较两个 JSON 的差异
 * @param json1 第一个 JSON
 * @param json2 第二个 JSON
 * @param format 输出格式：'text' | 'json' | 'html'
 * @returns 差异结果
 */
export function jsonDiffCompare(
  json1: string,
  json2: string,
  format: 'text' | 'json' | 'html' = 'text'
): DiffResult {
  try {
    const obj1 = JSON5.parse(json1)
    const obj2 = JSON5.parse(json2)
    
    // 使用 jsondiffpatch 进行深度比较
    const delta = jsonDiff(obj1, obj2)
    
    if (!delta) {
      return {
        success: true,
        result: '✅ 两个 JSON 完全相同',
        hasChanges: false,
      }
    }
    
    // 根据格式返回不同的结果
    if (format === 'json') {
      return {
        success: true,
        result: JSON.stringify(delta, null, 2),
        hasChanges: true,
      }
    }
    
    if (format === 'html') {
      // HTML 格式需要额外的处理，这里先返回文本格式
      return generateTextDiff(json1, json2)
    }
    
    // 默认返回文本格式
    return generateTextDiff(json1, json2)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'JSON 比较失败',
    }
  }
}

/**
 * 生成文本格式的差异
 */
function generateTextDiff(json1: string, json2: string): DiffResult {
  try {
    const obj1 = JSON5.parse(json1)
    const obj2 = JSON5.parse(json2)
    
    const str1 = JSON.stringify(obj1, null, 2)
    const str2 = JSON.stringify(obj2, null, 2)
    
    const patch = createTwoFilesPatch(
      'original.json',
      'modified.json',
      str1,
      str2,
      '',
      '',
      {
        context: 3,
      }
    )
    
    return {
      success: true,
      result: patch,
      hasChanges: str1 !== str2,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '生成差异失败',
    }
  }
}

/**
 * 获取差异统计信息
 */
export function getDiffStats(json1: string, json2: string): {
  added: number
  removed: number
  modified: number
  unchanged: number
} | null {
  try {
    const obj1 = JSON5.parse(json1)
    const obj2 = JSON5.parse(json2)
    
    const delta = jsonDiff(obj1, obj2)
    
    if (!delta) {
      return { added: 0, removed: 0, modified: 0, unchanged: Object.keys(obj1).length }
    }
    
    let added = 0
    let removed = 0
    let modified = 0
    
    // 遍历 delta 统计变化
    function countChanges(delta: any, path: string = '') {
      for (const key in delta) {
        const value = delta[key]
        const currentPath = path ? `${path}.${key}` : key
        
        if (Array.isArray(value) && value.length === 2) {
          // [old, new] 格式
          if (value[0] === undefined) {
            added++
          } else if (value[1] === undefined) {
            removed++
          } else {
            modified++
          }
        } else if (typeof value === 'object') {
          countChanges(value, currentPath)
        }
      }
    }
    
    countChanges(delta)
    
    return { added, removed, modified, unchanged: 0 }
  } catch {
    return null
  }
}
