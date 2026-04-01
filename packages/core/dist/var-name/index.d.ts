/**
 * 变量名格式转换工具
 */
export type VarFormat = 'camelCase' | 'PascalCase' | 'snake_case' | 'kebab-case' | 'CONSTANT_CASE' | 'dot.case' | 'space case';
/**
 * 转换为驼峰命名 (camelCase)
 */
export declare function toCamelCase(input: string): string;
/**
 * 转换为大驼峰命名 (PascalCase)
 */
export declare function toPascalCase(input: string): string;
/**
 * 转换为下划线命名 (snake_case)
 */
export declare function toSnakeCase(input: string): string;
/**
 * 转换为中划线命名 (kebab-case)
 */
export declare function toKebabCase(input: string): string;
/**
 * 转换为常量命名 (CONSTANT_CASE)
 */
export declare function toConstantCase(input: string): string;
/**
 * 转换为点分隔 (dot.case)
 */
export declare function toDotCase(input: string): string;
/**
 * 转换为空格分隔 (space case)
 */
export declare function toSpaceCase(input: string): string;
/**
 * 通用转换函数
 */
export declare function convertVarName(input: string, format: VarFormat): string;
/**
 * 批量转换
 */
export interface VarNameResult {
    original: string;
    camelCase: string;
    PascalCase: string;
    snake_case: string;
    kebab_case: string;
    CONSTANT_CASE: string;
    dot_case: string;
    space_case: string;
}
export declare function convertAll(input: string): VarNameResult;
