/**
 * JSON 增强功能测试
 */
import { describe, it, expect } from 'vitest'
import {
  jsonPathQuery,
  jsonToYaml,
  yamlToJson,
  jsonToXml,
  xmlToJson,
  jsonToCsv,
  csvToJson,
  jsonEscapeForLanguage,
  jsonDiffCompare,
} from '../src/json'

describe('JSONPath 查询', () => {
  const testData = JSON.stringify({
    store: {
      book: [
        { title: 'Book 1', author: 'Author A', price: 10 },
        { title: 'Book 2', author: 'Author B', price: 20 },
      ],
    },
  })

  it('应该支持根节点查询', () => {
    const result = jsonPathQuery(testData, '$')
    expect(result.success).toBe(true)
    expect(result.resultCount).toBe(1)
  })

  it('应该支持属性访问', () => {
    const result = jsonPathQuery(testData, '$.store.book')
    expect(result.success).toBe(true)
    expect(result.resultCount).toBe(2)
  })

  it('应该支持数组索引', () => {
    const result = jsonPathQuery(testData, '$.store.book[0]')
    expect(result.success).toBe(true)
    expect(result.result).toContain('Book 1')
  })

  it('应该支持递归下降', () => {
    const result = jsonPathQuery(testData, '$..author')
    expect(result.success).toBe(true)
    expect(result.resultCount).toBe(2)
  })
})

describe('格式转换', () => {
  const testJson = JSON.stringify({ name: 'Test', value: 123 })

  it('JSON 转 YAML', () => {
    const result = jsonToYaml(testJson)
    expect(result.success).toBe(true)
    expect(result.result).toContain('name: Test')
    expect(result.result).toContain('value: 123')
  })

  it('YAML 转 JSON', () => {
    const yaml = 'name: Test\nvalue: 123'
    const result = yamlToJson(yaml)
    expect(result.success).toBe(true)
    expect(result.result).toContain('"name": "Test"')
  })

  it('JSON 转 XML', () => {
    const result = jsonToXml(testJson)
    expect(result.success).toBe(true)
    expect(result.result).toContain('<name>Test</name>')
  })

  it('JSON 转 CSV', () => {
    const jsonArray = JSON.stringify([
      { name: 'A', age: 20 },
      { name: 'B', age: 30 },
    ])
    const result = jsonToCsv(jsonArray)
    expect(result.success).toBe(true)
    expect(result.result).toContain('name,age')
    expect(result.result).toContain('A,20')
  })

  it('CSV 转 JSON', () => {
    const csv = 'name,age\nA,20\nB,30'
    const result = csvToJson(csv)
    expect(result.success).toBe(true)
    expect(result.result).toContain('"name": "A"')
  })
})

describe('多语言转义', () => {
  const testJson = JSON.stringify({ key: 'value' })

  it('Java 转义', () => {
    const result = jsonEscapeForLanguage(testJson, 'java')
    expect(result.success).toBe(true)
    expect(result.result).startsWith('"')
    expect(result.result).endsWith('"')
  })

  it('Go 转义', () => {
    const result = jsonEscapeForLanguage(testJson, 'go')
    expect(result.success).toBe(true)
    expect(result.result).startsWith('`')
    expect(result.result).endsWith('`')
  })

  it('Python 转义', () => {
    const result = jsonEscapeForLanguage(testJson, 'python')
    expect(result.success).toBe(true)
    expect(result.result).startsWith('"""')
    expect(result.result).endsWith('"""')
  })

  it('MyBatis 转义', () => {
    const jsonWithQuote = JSON.stringify({ sql: "it's" })
    const result = jsonEscapeForLanguage(jsonWithQuote, 'mybatis')
    expect(result.success).toBe(true)
    expect(result.result).toContain("''")
  })
})

describe('JSON 差异比较', () => {
  const json1 = JSON.stringify({ name: 'Test', value: 1 })
  const json2 = JSON.stringify({ name: 'Test', value: 2 })
  const json3 = JSON.stringify({ name: 'Test', value: 1 })

  it('应该检测到差异', () => {
    const result = jsonDiffCompare(json1, json2)
    expect(result.success).toBe(true)
    expect(result.hasChanges).toBe(true)
    expect(result.result).toContain('-')
    expect(result.result).toContain('+')
  })

  it('应该检测到相同', () => {
    const result = jsonDiffCompare(json1, json3)
    expect(result.success).toBe(true)
    expect(result.hasChanges).toBe(false)
    expect(result.result).toContain('完全相同')
  })
})
