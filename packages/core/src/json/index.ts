/**
 * JSON 工具 - 主导出文件
 */
import JSON5 from 'json5'

export interface JsonResult {
  success: boolean
  result?: string
  error?: string
}

// 导出所有功能模块（使用显式导出避免命名冲突）
export {
  jsonFormat,
  jsonValidate,
  jsonMinify,
} from './format'

export {
  jsonEscape,
  jsonUnescape,
  jsonEscapeObject,
  jsonUnescapeObject,
  jsonEscapeAll,
  jsonUnescapeAll,
} from './escape'

export {
  jsonEscapeForLanguage,
  unescapeFromLanguage,
  getSupportedLanguages,
  type EscapeLanguage,
  type EscapeResult,
} from './escape-enhanced'

// 说明：JSON 的 jsonpath / convert / diff 模块已删除（依赖 js-yaml、xml-js、
// jsonpath-plus、diff、jsondiffpatch 未安装，且 web 端 JSON 工具已改为无外部依赖
// 的自实现）。如需恢复这些功能，请先在 core/package.json 安装上述依赖并实现。
