/**
 * JWT 解码工具
 */

export interface JWTPayload {
  header: Record<string, any>
  payload: Record<string, any>
  signature: string
  valid: boolean
  error?: string
}

/**
 * Base64Url 解码
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = base64.length % 4
  if (pad) {
    base64 += '='.repeat(4 - pad)
  }
  return decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )
}

/**
 * 解码 JWT
 */
export function decodeJWT(token: string): JWTPayload {
  try {
    const parts = token.trim().split('.')
    if (parts.length !== 3) {
      return {
        header: {},
        payload: {},
        signature: '',
        valid: false,
        error: '无效的 JWT 格式',
      }
    }
    
    const [headerB64, payloadB64, signature] = parts
    
    const header = JSON.parse(base64UrlDecode(headerB64))
    const payload = JSON.parse(base64UrlDecode(payloadB64))
    
    return {
      header,
      payload,
      signature,
      valid: true,
    }
  } catch (error) {
    return {
      header: {},
      payload: {},
      signature: '',
      valid: false,
      error: error instanceof Error ? error.message : '解码失败',
    }
  }
}

/**
 * 检查 JWT 是否过期
 */
export function isJWTExpired(token: string): boolean {
  const decoded = decodeJWT(token)
  if (!decoded.valid || !decoded.payload.exp) {
    return false
  }
  
  const now = Math.floor(Date.now() / 1000)
  return decoded.payload.exp < now
}

/**
 * 获取 JWT 过期时间
 */
export function getJWTExpiration(token: string): Date | null {
  const decoded = decodeJWT(token)
  if (!decoded.valid || !decoded.payload.exp) {
    return null
  }
  
  return new Date(decoded.payload.exp * 1000)
}

/**
 * JWT 签名验证结果
 */
export interface SignatureVerificationResult {
  valid: boolean
  error?: string
}

/**
 * 验证 JWT 签名 (支持 HS256, HS384, HS512)
 */
export function verifyJWTSignature(
  token: string,
  secret: string,
  algorithm: 'HS256' | 'HS384' | 'HS512' = 'HS256'
): SignatureVerificationResult {
  try {
    const parts = token.trim().split('.')
    if (parts.length !== 3) {
      return {
        valid: false,
        error: '无效的 JWT 格式',
      }
    }
    
    const [headerB64, payloadB64, signature] = parts
    const headerPart = `${headerB64}.${payloadB64}`
    
    // 使用 CryptoJS 进行 HMAC 签名
    const crypto = require('crypto-js')
    let hash: any
    
    switch (algorithm) {
      case 'HS256':
        hash = crypto.HmacSHA256(headerPart, secret)
        break
      case 'HS384':
        hash = crypto.HmacSHA384(headerPart, secret)
        break
      case 'HS512':
        hash = crypto.HmacSHA512(headerPart, secret)
        break
      default:
        return {
          valid: false,
          error: `不支持的算法：${algorithm}`,
        }
    }
    
    // Base64Url 编码
    const expectedSignature = hash
      .toString(crypto.enc.Base64)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
    
    return {
      valid: expectedSignature === signature,
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : '签名验证失败',
    }
  }
}

/**
 * 创建 JWT
 */
export function createJWT(
  payload: Record<string, any>,
  secret: string,
  algorithm: 'HS256' | 'HS384' | 'HS512' = 'HS256'
): string {
  const header = {
    alg: algorithm,
    typ: 'JWT',
  }
  
  // Base64Url 编码函数
  function base64UrlEncode(obj: any): string {
    const str = JSON.stringify(obj)
    const crypto = require('crypto-js')
    const base64 = crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(str))
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }
  
  const headerB64 = base64UrlEncode(header)
  const payloadB64 = base64UrlEncode(payload)
  const headerPart = `${headerB64}.${payloadB64}`
  
  // 生成签名
  const crypto = require('crypto-js')
  let hash: any
  
  switch (algorithm) {
    case 'HS256':
      hash = crypto.HmacSHA256(headerPart, secret)
      break
    case 'HS384':
      hash = crypto.HmacSHA384(headerPart, secret)
      break
    case 'HS512':
      hash = crypto.HmacSHA512(headerPart, secret)
      break
  }
  
  const signature = hash
    .toString(crypto.enc.Base64)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
  
  return `${headerB64}.${payloadB64}.${signature}`
}
