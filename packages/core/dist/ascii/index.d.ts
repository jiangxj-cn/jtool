/**
 * ASCII 编码转换工具
 * 支持字符串与 ASCII 码之间的转换
 * 支持十进制、十六进制、八进制、二进制格式
 */
export interface AsciiResult {
    success: boolean;
    result: string;
    error?: string;
}
export type AsciiFormat = 'decimal' | 'hex' | 'octal' | 'binary';
/**
 * 字符串转 ASCII 码（十进制）
 */
export declare function stringToAsciiDecimal(input: string): string;
/**
 * 字符串转 ASCII 码（十六进制）
 */
export declare function stringToAsciiHex(input: string): string;
/**
 * 字符串转 ASCII 码（八进制）
 */
export declare function stringToAsciiOctal(input: string): string;
/**
 * 字符串转 ASCII 码（二进制）
 */
export declare function stringToAsciiBinary(input: string): string;
/**
 * ASCII 码转字符串（十进制）
 */
export declare function asciiDecimalToString(input: string): string;
/**
 * ASCII 码转字符串（十六进制）
 */
export declare function asciiHexToString(input: string): string;
/**
 * ASCII 码转字符串（八进制）
 */
export declare function asciiOctalToString(input: string): string;
/**
 * ASCII 码转字符串（二进制）
 */
export declare function asciiBinaryToString(input: string): string;
/**
 * 字符串转 ASCII（支持多种格式）
 */
export declare function stringToAscii(input: string, format?: AsciiFormat): AsciiResult;
/**
 * ASCII 转字符串（支持多种格式）
 */
export declare function asciiToString(input: string, format?: AsciiFormat): AsciiResult;
/**
 * 自动检测格式并转换
 */
export declare function asciiAutoDetect(input: string): AsciiResult;
