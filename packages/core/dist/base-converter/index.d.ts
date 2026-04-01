/**
 * 进制转换工具
 */
/**
 * 十进制转任意进制（2-62）
 */
export declare function decimalToBase(num: number | string, base: number): string;
/**
 * 任意进制转十进制（2-62）
 */
export declare function baseToDecimal(str: string, base: number): number;
/**
 * 任意进制间转换
 */
export declare function convertBase(str: string, fromBase: number, toBase: number): string;
/**
 * 常用进制转换
 */
export interface BaseConversionResult {
    binary: string;
    octal: string;
    decimal: string;
    hexadecimal: string;
    base32: string;
    base62: string;
}
export declare function convertAll(input: string, fromBase?: number): BaseConversionResult;
