/**
 * JSON 格式转换功能
 */
import JSON5 from 'json5'
import jsYaml from 'js-yaml'
import { xml2js, js2xml } from 'xml-js'
import type { JsonResult } from './index'

export interface ConvertResult extends JsonResult {
  sourceFormat?: string
  targetFormat?: string
}

/**
 * JSON 转 YAML
 */
export function jsonToYaml(json: string): ConvertResult {
  try {
    const obj = JSON5.parse(json)
    const yaml = jsYaml.dump(obj, {
      indent: 2,
      lineWidth: -1, // 不限制行宽
      noRefs: true,  // 不使用引用
    })
    return {
      success: true,
      result: yaml,
      sourceFormat: 'JSON',
      targetFormat: 'YAML',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'JSON 转 YAML 失败',
      sourceFormat: 'JSON',
      targetFormat: 'YAML',
    }
  }
}

/**
 * YAML 转 JSON
 */
export function yamlToJson(yaml: string): ConvertResult {
  try {
    const obj = jsYaml.load(yaml)
    const json = JSON.stringify(obj, null, 2)
    return {
      success: true,
      result: json,
      sourceFormat: 'YAML',
      targetFormat: 'JSON',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'YAML 转 JSON 失败',
      sourceFormat: 'YAML',
      targetFormat: 'JSON',
    }
  }
}

/**
 * JSON 转 XML
 */
export function jsonToXml(json: string): ConvertResult {
  try {
    const obj = JSON5.parse(json)
    const result = js2xml(obj, {
      compact: false,
      spaces: 2,
    })
    return {
      success: true,
      result,
      sourceFormat: 'JSON',
      targetFormat: 'XML',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'JSON 转 XML 失败',
      sourceFormat: 'JSON',
      targetFormat: 'XML',
    }
  }
}

/**
 * XML 转 JSON
 */
export function xmlToJson(xml: string): ConvertResult {
  try {
    const result = xml2js(xml, {
      compact: false,
      spaces: 2
    } as any)
    const json = JSON.stringify(result, null, 2)
    return {
      success: true,
      result: json,
      sourceFormat: 'XML',
      targetFormat: 'JSON',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'XML 转 JSON 失败',
      sourceFormat: 'XML',
      targetFormat: 'JSON',
    }
  }
}

/**
 * JSON 转 CSV
 * 仅支持扁平化的 JSON 数组或对象
 */
export function jsonToCsv(json: string): ConvertResult {
  try {
    const obj = JSON5.parse(json)
    
    // 如果是单个对象，转为数组
    const dataArray = Array.isArray(obj) ? obj : [obj]
    
    if (dataArray.length === 0) {
      return {
        success: false,
        error: '空数据',
        sourceFormat: 'JSON',
        targetFormat: 'CSV',
      }
    }
    
    // 获取所有键名（合并所有对象的键）
    const headers = Array.from(
      new Set(dataArray.flatMap(obj => Object.keys(obj)))
    )
    
    // 生成 CSV
    const lines: string[] = []
    
    // 表头
    lines.push(headers.join(','))
    
    // 数据行
    for (const item of dataArray) {
      const row = headers.map(header => {
        const value = item[header]
        if (value === null || value === undefined) {
          return ''
        }
        // 如果值包含逗号、换行或引号，需要引起来
        const str = String(value)
        if (str.includes(',') || str.includes('\n') || str.includes('"')) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      })
      lines.push(row.join(','))
    }
    
    return {
      success: true,
      result: lines.join('\n'),
      sourceFormat: 'JSON',
      targetFormat: 'CSV',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'JSON 转 CSV 失败',
      sourceFormat: 'JSON',
      targetFormat: 'CSV',
    }
  }
}

/**
 * CSV 转 JSON
 */
export function csvToJson(csv: string): ConvertResult {
  try {
    const lines = csv.trim().split('\n')
    
    if (lines.length === 0) {
      return {
        success: false,
        error: '空 CSV',
        sourceFormat: 'CSV',
        targetFormat: 'JSON',
      }
    }
    
    // 解析表头
    const headers = parseCSVLine(lines[0])
    
    // 解析数据行
    const result = []
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      const obj: Record<string, string> = {}
      headers.forEach((header, index) => {
        obj[header] = values[index] || ''
      })
      result.push(obj)
    }
    
    return {
      success: true,
      result: JSON.stringify(result, null, 2),
      sourceFormat: 'CSV',
      targetFormat: 'JSON',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'CSV 转 JSON 失败',
      sourceFormat: 'CSV',
      targetFormat: 'JSON',
    }
  }
}

/**
 * 解析 CSV 行（处理引号）
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++ // 跳过下一个引号
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current)
  return result
}

/**
 * JSON 转 JavaScript 对象字面量
 */
export function jsonToJsObject(json: string): ConvertResult {
  try {
    const obj = JSON5.parse(json)
    const jsString = JSON.stringify(obj, null, 2)
      .replace(/"([^"]+)":/g, '$1:')  // 移除键的引号
      .replace(/"/g, "'")              // 字符串使用单引号
    return {
      success: true,
      result: jsString,
      sourceFormat: 'JSON',
      targetFormat: 'JavaScript',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'JSON 转 JS 对象失败',
      sourceFormat: 'JSON',
      targetFormat: 'JavaScript',
    }
  }
}
