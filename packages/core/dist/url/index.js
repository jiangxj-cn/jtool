/**
 * URL 编码工具
 */
/**
 * URL 编码
 */
export function urlEncode(input) {
    return encodeURIComponent(input);
}
/**
 * URL 解码
 */
export function urlDecode(input) {
    try {
        return {
            success: true,
            result: decodeURIComponent(input),
        };
    }
    catch (error) {
        return {
            success: false,
            result: '',
            error: '解码失败：无效的 URL 编码',
        };
    }
}
/**
 * 编码或解码
 */
export function url(input, mode) {
    if (mode === 'encode') {
        return { success: true, result: urlEncode(input) };
    }
    else {
        return urlDecode(input);
    }
}
