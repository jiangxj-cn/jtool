/**
 * 哈希计算工具
 */
import CryptoJS from 'crypto-js';
/**
 * 计算单个哈希
 */
export function hash(input, algorithm = 'md5') {
    switch (algorithm) {
        case 'md5':
            return CryptoJS.MD5(input).toString();
        case 'sha1':
            return CryptoJS.SHA1(input).toString();
        case 'sha256':
            return CryptoJS.SHA256(input).toString();
        case 'sha512':
            return CryptoJS.SHA512(input).toString();
        default:
            throw new Error(`Unsupported algorithm: ${algorithm}`);
    }
}
/**
 * 计算所有哈希
 */
export function hashAll(input) {
    return {
        md5: hash(input, 'md5'),
        sha1: hash(input, 'sha1'),
        sha256: hash(input, 'sha256'),
        sha512: hash(input, 'sha512'),
    };
}
/**
 * 批量计算哈希
 */
export function batchHash(inputs, algorithm = 'md5') {
    return inputs.map(input => ({
        algorithm,
        hash: hash(input, algorithm),
        input,
    }));
}
