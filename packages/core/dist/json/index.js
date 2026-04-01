/**
 * JSON 工具
 */
import JSON5 from 'json5';
/**
 * JSON 格式化
 */
export function jsonFormat(input, space = 2) {
    try {
        const obj = JSON5.parse(input);
        return {
            success: true,
            result: JSON.stringify(obj, null, space),
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '无效的 JSON',
        };
    }
}
/**
 * JSON 校验
 */
export function jsonValidate(input) {
    try {
        JSON5.parse(input);
        return { valid: true };
    }
    catch (error) {
        return {
            valid: false,
            error: error instanceof Error ? error.message : '无效的 JSON',
        };
    }
}
/**
 * JSON 压缩
 */
export function jsonMinify(input) {
    try {
        const obj = JSON5.parse(input);
        return {
            success: true,
            result: JSON.stringify(obj),
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '无效的 JSON',
        };
    }
}
/**
 * JSON 转义（字符串转 JSON 字符串）
 */
export function jsonEscape(input) {
    return JSON.stringify(input);
}
/**
 * JSON 去除转义（JSON 字符串转普通字符串）
 */
export function jsonUnescape(input) {
    try {
        return JSON.parse(input);
    }
    catch {
        return input;
    }
}
/**
 * JSON 对象转义（添加转义符）
 */
export function jsonEscapeObject(input) {
    try {
        const obj = JSON5.parse(input);
        return JSON.stringify(obj);
    }
    catch (error) {
        throw new Error('无效的 JSON 输入');
    }
}
/**
 * JSON 对象去除转义（移除转义符）
 */
export function jsonUnescapeObject(input) {
    try {
        const obj = JSON.parse(input);
        return JSON5.stringify(obj, null, 2);
    }
    catch (error) {
        throw new Error('无效的 JSON 输入');
    }
}
/**
 * JSON 转义所有特殊字符
 */
export function jsonEscapeAll(input) {
    return input
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
}
/**
 * JSON 去除所有转义
 */
export function jsonUnescapeAll(input) {
    return input
        .replace(/\\"/g, '"')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\\\/g, '\\');
}
