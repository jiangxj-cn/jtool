/**
 * 正则表达式测试工具
 */
export interface RegexMatch {
    match: string;
    index: number;
    groups: string[];
}
export interface RegexTestResult {
    valid: boolean;
    error?: string;
    matches: RegexMatch[];
    testString: string;
    flags: string;
}
/**
 * 测试正则表达式
 */
export declare function testRegex(pattern: string, testString: string, flags?: string): RegexTestResult;
/**
 * 正则替换
 */
export declare function regexReplace(pattern: string, input: string, replacement: string, flags?: string): {
    success: boolean;
    result?: string;
    error?: string;
};
/**
 * 常用正则表达式
 */
export declare const COMMON_REGEX_PATTERNS: {
    email: RegExp;
    phone: RegExp;
    url: RegExp;
    ip: RegExp;
    idCard: RegExp;
    qq: RegExp;
    postalCode: RegExp;
    username: RegExp;
    password: RegExp;
    chinese: RegExp;
};
/**
 * 获取常用正则说明
 */
export declare function getCommonRegexDesc(name: string): string;
