/**
 * JSONPath 查询功能
 */
import JSON5 from 'json5'
import { JSONPath } from 'jsonpath-plus'
import type { JsonResult } from './index'

export interface JSONPathResult extends JsonResult {
  path?: string
  resultCount?: number
}

/**
 * JSONPath 查询
 * @param json JSON 字符串
 * @param path JSONPath 表达式，如 $.store.book[*].author
 * @returns 查询结果
 */
export function jsonPathQuery(json: string, path: string): JSONPathResult {
  try {
    if (!path || path.trim() === '') {
      return {
        success: false,
        error: '请输入 JSONPath 表达式',
      }
    }

    const obj = JSON5.parse(json)
    const result = JSONPath({ path, json: obj })

    if (!result || result.length === 0) {
      return {
        success: true,
        result: '未找到匹配的结果',
        path,
        resultCount: 0,
      }
    }

    return {
      success: true,
      result: Array.isArray(result)
        ? JSON.stringify(result, null, 2)
        : JSON.stringify(result, null, 2),
      path,
      resultCount: Array.isArray(result) ? result.length : 1,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'JSONPath 查询失败',
      path,
    }
  }
}

/**
 * 获取 JSONPath 示例
 */
export function getJsonPathExamples(): Array<{ name: string; path: string; description: string }> {
  return [
    {
      name: '根节点',
      path: '$',
      description: '选择根节点',
    },
    {
      name: '属性访问',
      path: '$.store.book',
      description: '访问嵌套属性',
    },
    {
      name: '数组索引',
      path: '$.store.book[0]',
      description: '访问数组第一个元素',
    },
    {
      name: '数组通配符',
      path: '$.store.book[*]',
      description: '访问数组所有元素',
    },
    {
      name: '递归下降',
      path: '$..author',
      description: '递归查找所有 author 字段',
    },
    {
      name: '过滤表达式',
      path: '$.store.book[?(@.price < 10)]',
      description: '过滤 price < 10 的书籍',
    },
    {
      name: '多属性',
      path: '$.store.book[*].[title,author]',
      description: '选择多个属性',
    },
  ]
}
