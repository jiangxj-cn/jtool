/**
 * 文本处理工具
 */
/**
 * 转大写
 */
export function toUpperCase(text) {
    return text.toUpperCase();
}
/**
 * 转小写
 */
export function toLowerCase(text) {
    return text.toLowerCase();
}
/**
 * 行去重
 */
export function removeDuplicateLines(text) {
    const lines = text.split('\n');
    const unique = [...new Set(lines)];
    return unique.join('\n');
}
/**
 * 行排序
 */
export function sortLines(text, ascending = true) {
    const lines = text.split('\n');
    lines.sort(ascending ? undefined : (a, b) => b.localeCompare(a));
    return lines.join('\n');
}
/**
 * 添加行号
 */
export function addLineNumbers(text, start = 1) {
    const lines = text.split('\n');
    return lines.map((line, i) => `${start + i}. ${line}`).join('\n');
}
/**
 * 去除空行
 */
export function removeEmptyLines(text) {
    return text
        .split('\n')
        .filter(line => line.trim() !== '')
        .join('\n');
}
/**
 * 文本统计
 */
export function textStats(text) {
    const characters = text.length;
    const charactersNoSpace = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split('\n').length : 0;
    const paragraphs = text ? text.split(/\n\s*\n/).filter(p => p.trim() !== '').length : 0;
    return {
        characters,
        charactersNoSpace,
        words,
        lines,
        paragraphs,
    };
}
/**
 * 替换空白字符
 */
export function normalizeWhitespace(text) {
    return text.replace(/\s+/g, ' ').trim();
}
