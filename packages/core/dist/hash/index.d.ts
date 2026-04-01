export type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512';
export interface HashResult {
    algorithm: HashAlgorithm;
    hash: string;
    input: string;
}
/**
 * 计算单个哈希
 */
export declare function hash(input: string, algorithm?: HashAlgorithm): string;
/**
 * 计算所有哈希
 */
export declare function hashAll(input: string): Record<HashAlgorithm, string>;
/**
 * 批量计算哈希
 */
export declare function batchHash(inputs: string[], algorithm?: HashAlgorithm): HashResult[];
