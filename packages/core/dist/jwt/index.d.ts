/**
 * JWT 解码工具
 */
export interface JWTPayload {
    header: Record<string, any>;
    payload: Record<string, any>;
    signature: string;
    valid: boolean;
    error?: string;
}
/**
 * 解码 JWT
 */
export declare function decodeJWT(token: string): JWTPayload;
/**
 * 检查 JWT 是否过期
 */
export declare function isJWTExpired(token: string): boolean;
/**
 * 获取 JWT 过期时间
 */
export declare function getJWTExpiration(token: string): Date | null;
