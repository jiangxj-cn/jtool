/**
 * JWT 解码工具
 */
/**
 * Base64Url 解码
 */
function base64UrlDecode(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) {
        base64 += '='.repeat(4 - pad);
    }
    return decodeURIComponent(atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''));
}
/**
 * 解码 JWT
 */
export function decodeJWT(token) {
    try {
        const parts = token.trim().split('.');
        if (parts.length !== 3) {
            return {
                header: {},
                payload: {},
                signature: '',
                valid: false,
                error: '无效的 JWT 格式',
            };
        }
        const [headerB64, payloadB64, signature] = parts;
        const header = JSON.parse(base64UrlDecode(headerB64));
        const payload = JSON.parse(base64UrlDecode(payloadB64));
        return {
            header,
            payload,
            signature,
            valid: true,
        };
    }
    catch (error) {
        return {
            header: {},
            payload: {},
            signature: '',
            valid: false,
            error: error instanceof Error ? error.message : '解码失败',
        };
    }
}
/**
 * 检查 JWT 是否过期
 */
export function isJWTExpired(token) {
    const decoded = decodeJWT(token);
    if (!decoded.valid || !decoded.payload.exp) {
        return false;
    }
    const now = Math.floor(Date.now() / 1000);
    return decoded.payload.exp < now;
}
/**
 * 获取 JWT 过期时间
 */
export function getJWTExpiration(token) {
    const decoded = decodeJWT(token);
    if (!decoded.valid || !decoded.payload.exp) {
        return null;
    }
    return new Date(decoded.payload.exp * 1000);
}
