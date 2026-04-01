/**
 * 文本处理工具
 */
export interface TextStats {
    characters: number;
    charactersNoSpace: number;
    words: number;
    lines: number;
    paragraphs: number;
}
/**
 * 转大写
 */
export declare function toUpperCase(text: string): string;
/**
 * 转小写
 */
export declare function toLowerCase(text: string): string;
/**
 * 行去重
 */
export declare function removeDuplicateLines(text: string): string;
/**
 * 行排序
 */
export declare function sortLines(text: string, ascending?: boolean): string;
/**
 * 添加行号
 */
export declare function addLineNumbers(text: string, start?: number): string;
/**
 * 去除空行
 */
export declare function removeEmptyLines(text: string): string;
/**
 * 文本统计
 */
export declare function textStats(text: string): TextStats;
/**
 * 替换空白字符
 */
export declare function normalizeWhitespace(text: string): string;
