/**
 * 正则表达式测试工具
 */
/**
 * 测试正则表达式
 */
export function testRegex(pattern, testString, flags = 'g') {
    try {
        const regex = new RegExp(pattern, flags);
        const matches = [];
        let match;
        while ((match = regex.exec(testString)) !== null) {
            matches.push({
                match: match[0],
                index: match.index,
                groups: match.slice(1),
            });
            // 防止无限循环
            if (regex.lastIndex === match.index) {
                regex.lastIndex++;
            }
        }
        return {
            valid: true,
            matches,
            testString,
            flags,
        };
    }
    catch (error) {
        return {
            valid: false,
            error: error instanceof Error ? error.message : '无效的正则表达式',
            matches: [],
            testString,
            flags,
        };
    }
}
/**
 * 正则替换
 */
export function regexReplace(pattern, input, replacement, flags = 'g') {
    try {
        const regex = new RegExp(pattern, flags);
        return {
            success: true,
            result: input.replace(regex, replacement),
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '正则表达式错误',
        };
    }
}
/**
 * 常用正则表达式
 */
export const COMMON_REGEX_PATTERNS = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^1[3-9]\d{9}$/,
    url: /^https?:\/\/[^\s]+$/,
    ip: /^(\d{1,3}\.){3}\d{1,3}$/,
    idCard: /^\d{17}[\dXx]$/,
    qq: /^[1-9]\d{4,}$/,
    postalCode: /^\d{6}$/,
    username: /^[a-zA-Z]\w{2,19}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    chinese: /^[\u4e00-\u9fa5]+$/,
};
/**
 * 获取常用正则说明
 */
export function getCommonRegexDesc(name) {
    const descriptions = {
        email: '邮箱地址',
        phone: '中国大陆手机号',
        url: '网址 URL',
        ip: 'IPv4 地址',
        idCard: '身份证号码',
        qq: 'QQ 号码',
        postalCode: '邮政编码',
        username: '用户名（字母开头，3-20 位）',
        password: '强密码（大小写字母 + 数字，8 位以上）',
        chinese: '中文字符',
    };
    return descriptions[name] || '';
}
