/**
 * BASE64 编码工具
 */
/**
 * BASE64 编码
 */
export function base64Encode(input) {
    try {
        return btoa(unescape(encodeURIComponent(input)));
    }
    catch (error) {
        throw new Error('编码失败：无效的输入');
    }
}
/**
 * BASE64 解码
 */
export function base64Decode(input) {
    try {
        return decodeURIComponent(escape(atob(input)));
    }
    catch (error) {
        throw new Error('解码失败：无效的 BASE64 字符串');
    }
}
/**
 * 编码或解码
 */
export function base64(input, mode) {
    try {
        const result = mode === 'encode' ? base64Encode(input) : base64Decode(input);
        return { success: true, result };
    }
    catch (error) {
        return {
            success: false,
            result: '',
            error: error instanceof Error ? error.message : '未知错误',
        };
    }
}
