export interface JsonResult {
    success: boolean;
    result?: string;
    error?: string;
}
export { jsonFormat, jsonValidate, jsonMinify, } from './format';
export { jsonEscape, jsonUnescape, jsonEscapeObject, jsonUnescapeObject, jsonEscapeAll, jsonUnescapeAll, } from './escape';
export { jsonPathQuery, getJsonPathExamples, type JSONPathResult, } from './jsonpath';
export { jsonToYaml, yamlToJson, jsonToXml, xmlToJson, jsonToCsv, csvToJson, jsonToJsObject, type ConvertResult, } from './convert';
export { jsonDiffCompare, getDiffStats, type DiffResult, } from './diff';
export { jsonEscapeForLanguage, unescapeFromLanguage, getSupportedLanguages, type EscapeLanguage, type EscapeResult, } from './escape-enhanced';
