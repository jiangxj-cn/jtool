/**
 * 哈希计算工具
 */
import CryptoJS from 'crypto-js'

export type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512'

export interface HashResult {
  algorithm: HashAlgorithm
  hash: string
  input: string
}

/**
 * 计算单个哈希
 */
export function hash(input: string, algorithm: HashAlgorithm = 'md5'): string {
  switch (algorithm) {
    case 'md5':
      return CryptoJS.MD5(input).toString()
    case 'sha1':
      return CryptoJS.SHA1(input).toString()
    case 'sha256':
      return CryptoJS.SHA256(input).toString()
    case 'sha512':
      return CryptoJS.SHA512(input).toString()
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`)
  }
}

/**
 * 计算所有哈希
 */
export function hashAll(input: string): Record<HashAlgorithm, string> {
  return {
    md5: hash(input, 'md5'),
    sha1: hash(input, 'sha1'),
    sha256: hash(input, 'sha256'),
    sha512: hash(input, 'sha512'),
  }
}

/**
 * 批量计算哈希
 */
export function batchHash(inputs: string[], algorithm: HashAlgorithm = 'md5'): HashResult[] {
  return inputs.map(input => ({
    algorithm,
    hash: hash(input, algorithm),
    input,
  }))
}
