/**
 * URL 编码工具
 */
export interface UrlResult {
    success: boolean;
    result: string;
    error?: string;
}
/**
 * URL 编码
 */
export declare function urlEncode(input: string): string;
/**
 * URL 解码
 */
export declare function urlDecode(input: string): UrlResult;
/**
 * 编码或解码
 */
export declare function url(input: string, mode: 'encode' | 'decode'): UrlResult;
