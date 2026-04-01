/**
 * URL 编码工具
 */

export interface UrlResult {
  success: boolean
  result: string
  error?: string
}

/**
 * URL 编码
 */
export function urlEncode(input: string): string {
  return encodeURIComponent(input)
}

/**
 * URL 解码
 */
export function urlDecode(input: string): UrlResult {
  try {
    return {
      success: true,
      result: decodeURIComponent(input),
    }
  } catch (error) {
    return {
      success: false,
      result: '',
      error: '解码失败：无效的 URL 编码',
    }
  }
}

/**
 * 编码或解码
 */
export function url(input: string, mode: 'encode' | 'decode'): UrlResult {
  if (mode === 'encode') {
    return { success: true, result: urlEncode(input) }
  } else {
    return urlDecode(input)
  }
}
