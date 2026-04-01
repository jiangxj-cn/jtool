/**
 * ASCII 编码转换工具
 * 支持字符串与 ASCII 码之间的转换
 * 支持十进制、十六进制、八进制、二进制格式
 */
/**
 * 字符串转 ASCII 码（十进制）
 */
export function stringToAsciiDecimal(input) {
    return input.split('').map(char => char.charCodeAt(0).toString()).join(' ');
}
/**
 * 字符串转 ASCII 码（十六进制）
 */
export function stringToAsciiHex(input) {
    return input.split('').map(char => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join(' ');
}
/**
 * 字符串转 ASCII 码（八进制）
 */
export function stringToAsciiOctal(input) {
    return input.split('').map(char => '0' + char.charCodeAt(0).toString(8)).join(' ');
}
/**
 * 字符串转 ASCII 码（二进制）
 */
export function stringToAsciiBinary(input) {
    return input.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}
/**
 * ASCII 码转字符串（十进制）
 */
export function asciiDecimalToString(input) {
    const codes = input.trim().split(/\s+/).filter(s => s.length > 0);
    return codes.map(code => {
        const num = parseInt(code, 10);
        if (isNaN(num) || num < 0 || num > 255) {
            throw new Error(`无效的十进制 ASCII 码：${code}`);
        }
        return String.fromCharCode(num);
    }).join('');
}
/**
 * ASCII 码转字符串（十六进制）
 */
export function asciiHexToString(input) {
    const codes = input.trim().split(/\s+/).filter(s => s.length > 0);
    return codes.map(code => {
        const num = parseInt(code, 16);
        if (isNaN(num) || num < 0 || num > 255) {
            throw new Error(`无效的十六进制 ASCII 码：${code}`);
        }
        return String.fromCharCode(num);
    }).join('');
}
/**
 * ASCII 码转字符串（八进制）
 */
export function asciiOctalToString(input) {
    const codes = input.trim().split(/\s+/).filter(s => s.length > 0);
    return codes.map(code => {
        const num = parseInt(code, 8);
        if (isNaN(num) || num < 0 || num > 255) {
            throw new Error(`无效的八进制 ASCII 码：${code}`);
        }
        return String.fromCharCode(num);
    }).join('');
}
/**
 * ASCII 码转字符串（二进制）
 */
export function asciiBinaryToString(input) {
    const codes = input.trim().split(/\s+/).filter(s => s.length > 0);
    return codes.map(code => {
        const num = parseInt(code, 2);
        if (isNaN(num) || num < 0 || num > 255) {
            throw new Error(`无效的二进制 ASCII 码：${code}`);
        }
        return String.fromCharCode(num);
    }).join('');
}
/**
 * 字符串转 ASCII（支持多种格式）
 */
export function stringToAscii(input, format = 'decimal') {
    try {
        if (!input) {
            return { success: false, result: '', error: '输入不能为空' };
        }
        let result;
        switch (format) {
            case 'decimal':
                result = stringToAsciiDecimal(input);
                break;
            case 'hex':
                result = stringToAsciiHex(input);
                break;
            case 'octal':
                result = stringToAsciiOctal(input);
                break;
            case 'binary':
                result = stringToAsciiBinary(input);
                break;
            default:
                result = stringToAsciiDecimal(input);
        }
        return { success: true, result };
    }
    catch (error) {
        return {
            success: false,
            result: '',
            error: error instanceof Error ? error.message : '转换失败',
        };
    }
}
/**
 * ASCII 转字符串（支持多种格式）
 */
export function asciiToString(input, format = 'decimal') {
    try {
        if (!input || !input.trim()) {
            return { success: false, result: '', error: '输入不能为空' };
        }
        let result;
        switch (format) {
            case 'decimal':
                result = asciiDecimalToString(input);
                break;
            case 'hex':
                result = asciiHexToString(input);
                break;
            case 'octal':
                result = asciiOctalToString(input);
                break;
            case 'binary':
                result = asciiBinaryToString(input);
                break;
            default:
                result = asciiDecimalToString(input);
        }
        return { success: true, result };
    }
    catch (error) {
        return {
            success: false,
            result: '',
            error: error instanceof Error ? error.message : '转换失败',
        };
    }
}
/**
 * 自动检测格式并转换
 */
export function asciiAutoDetect(input) {
    try {
        if (!input || !input.trim()) {
            return { success: false, result: '', error: '输入不能为空' };
        }
        const codes = input.trim().split(/\s+/).filter(s => s.length > 0);
        if (codes.length === 0) {
            return { success: false, result: '', error: '无效的输入格式' };
        }
        // 检测格式
        let format = 'decimal';
        const firstCode = codes[0];
        if (firstCode.startsWith('0b') || /^[01]{8}$/.test(firstCode)) {
            format = 'binary';
        }
        else if (firstCode.startsWith('0x') || /^[0-9A-Fa-f]{2}$/.test(firstCode)) {
            format = 'hex';
        }
        else if (firstCode.startsWith('0') && firstCode.length > 1 && /^[0-7]+$/.test(firstCode)) {
            format = 'octal';
        }
        else if (/^\d+$/.test(firstCode)) {
            format = 'decimal';
        }
        return asciiToString(input, format);
    }
    catch (error) {
        return {
            success: false,
            result: '',
            error: error instanceof Error ? error.message : '自动检测失败',
        };
    }
}
