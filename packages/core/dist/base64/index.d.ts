/**
 * BASE64 编码工具
 */
export interface Base64Result {
    success: boolean;
    result: string;
    error?: string;
}
/**
 * BASE64 编码
 */
export declare function base64Encode(input: string): string;
/**
 * BASE64 解码
 */
export declare function base64Decode(input: string): string;
/**
 * 编码或解码
 */
export declare function base64(input: string, mode: 'encode' | 'decode'): Base64Result;
