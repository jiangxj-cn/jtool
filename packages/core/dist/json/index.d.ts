export interface JsonResult {
    success: boolean;
    result?: string;
    error?: string;
}
/**
 * JSON 格式化
 */
export declare function jsonFormat(input: string, space?: number): JsonResult;
/**
 * JSON 校验
 */
export declare function jsonValidate(input: string): {
    valid: boolean;
    error?: string;
};
/**
 * JSON 压缩
 */
export declare function jsonMinify(input: string): JsonResult;
/**
 * JSON 转义（字符串转 JSON 字符串）
 */
export declare function jsonEscape(input: string): string;
/**
 * JSON 去除转义（JSON 字符串转普通字符串）
 */
export declare function jsonUnescape(input: string): string;
/**
 * JSON 对象转义（添加转义符）
 */
export declare function jsonEscapeObject(input: string): string;
/**
 * JSON 对象去除转义（移除转义符）
 */
export declare function jsonUnescapeObject(input: string): string;
/**
 * JSON 转义所有特殊字符
 */
export declare function jsonEscapeAll(input: string): string;
/**
 * JSON 去除所有转义
 */
export declare function jsonUnescapeAll(input: string): string;
