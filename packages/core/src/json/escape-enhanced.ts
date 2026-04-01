/**
 * 增强的 JSON 转义功能
 * 支持多种编程语言和场景
 */
import JSON5 from 'json5'
import type { JsonResult } from './index'

export type EscapeLanguage = 'java' | 'go' | 'python' | 'javascript' | 'mybatis' | 'sql' | 'csharp' | 'rust'

export interface EscapeResult extends JsonResult {
  language?: EscapeLanguage
}

/**
 * 多语言转义
 */
export function jsonEscapeForLanguage(json: string, language: EscapeLanguage): EscapeResult {
  try {
    // 先解析 JSON 确保有效
    const obj = JSON5.parse(json)
    const jsonString = JSON.stringify(obj)
    
    let result: string
    
    switch (language) {
      case 'java':
        // Java 字符串转义
        result = escapeJavaString(jsonString)
        break
        
      case 'go':
        // Go 反引号字符串（原始字符串）
        result = '`' + jsonString.replace(/`/g, '\\`') + '`'
        break
        
      case 'python':
        // Python 三引号字符串
        result = '"""' + jsonString.replace(/"""/g, '\\"\\"\\"') + '"""'
        break
        
      case 'javascript':
        // JavaScript 模板字符串
        result = '`' + jsonString.replace(/`/g, '\\`').replace(/\$/g, '\\$') + '`'
        break
        
      case 'mybatis':
        // MyBatis SQL 转义（单引号加倍）
        result = jsonString.replace(/'/g, "''")
        break
        
      case 'sql':
        // 通用 SQL 转义
        result = jsonString.replace(/'/g, "''").replace(/\\/g, '\\\\')
        break
        
      case 'csharp':
        // C# 逐字字符串
        result = '@"' + jsonString.replace(/"/g, '""') + '"'
        break
        
      case 'rust':
        // Rust 原始字符串
        result = 'r#"' + jsonString + '"#'
        break
        
      default:
        result = jsonString
    }
    
    return {
      success: true,
      result,
      language,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '转义失败',
      language,
    }
  }
}

/**
 * Java 字符串转义
 */
function escapeJavaString(str: string): string {
  return (
    '"' +
    str
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      .replace(/\f/g, '\\f')
      .replace(/\b/g, '\\b')
      .replace(/'/g, "\\'") +
    '"'
  )
}

/**
 * 获取支持的编程语言列表
 */
export function getSupportedLanguages(): Array<{
  value: EscapeLanguage
  label: string
  description: string
  example: string
}> {
  return [
    {
      value: 'java',
      label: 'Java',
      description: 'Java 字符串字面量，自动转义特殊字符',
      example: '"{\\"key\\": \\"value\\"}"',
    },
    {
      value: 'go',
      label: 'Go',
      description: 'Go 反引号原始字符串',
      example: '`{"key": "value"}`',
    },
    {
      value: 'python',
      label: 'Python',
      description: 'Python 三引号字符串',
      example: '"""{"key": "value"}"""',
    },
    {
      value: 'javascript',
      label: 'JavaScript',
      description: 'JavaScript 模板字符串',
      example: '`{"key": "value"}`',
    },
    {
      value: 'mybatis',
      label: 'MyBatis',
      description: 'MyBatis SQL 中的单引号转义',
      example: '{"key": "value"} (单引号变为\'\')',
    },
    {
      value: 'sql',
      label: 'SQL',
      description: '通用 SQL 字符串转义',
      example: '{"key": "value"}',
    },
    {
      value: 'csharp',
      label: 'C#',
      description: 'C# 逐字字符串',
      example: '@"{""key"": ""value""}"',
    },
    {
      value: 'rust',
      label: 'Rust',
      description: 'Rust 原始字符串',
      example: 'r#"{"key": "value"}"#',
    },
  ]
}

/**
 * MyBatis SQL 专用转义（快捷方法）
 */
export function jsonEscapeForMyBatis(json: string): string {
  const result = jsonEscapeForLanguage(json, 'mybatis')
  return result.success && result.result ? result.result : json
}

/**
 * 从转义字符串中恢复 JSON
 */
export function unescapeFromLanguage(escaped: string, language: EscapeLanguage): EscapeResult {
  try {
    let jsonStr = escaped
    
    // 移除语言特定的包装
    switch (language) {
      case 'go':
        if (escaped.startsWith('`') && escaped.endsWith('`')) {
          jsonStr = escaped.slice(1, -1)
        }
        break
        
      case 'python':
        if (escaped.startsWith('"""') && escaped.endsWith('"""')) {
          jsonStr = escaped.slice(3, -3)
        }
        break
        
      case 'javascript':
        if (escaped.startsWith('`') && escaped.endsWith('`')) {
          jsonStr = escaped.slice(1, -1).replace(/\\`/g, '`').replace(/\\\$/g, '$')
        }
        break
        
      case 'csharp':
        if (escaped.startsWith('@') && escaped.startsWith('"', 1)) {
          jsonStr = escaped.slice(2, -1).replace(/""/g, '"')
        }
        break
        
      case 'rust':
        if (escaped.startsWith('r#"') && escaped.endsWith('"#')) {
          jsonStr = escaped.slice(3, -2)
        }
        break
        
      default:
        jsonStr = escaped
    }
    
    // 验证是否为有效 JSON
    const obj = JSON5.parse(jsonStr)
    
    return {
      success: true,
      result: JSON.stringify(obj, null, 2),
      language,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '无法解析为 JSON',
      language,
    }
  }
}
