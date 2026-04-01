/**
 * UUID 生成工具 - 简化版
 * 使用 crypto.randomUUID() 生成 UUID v4
 */

export interface BatchUUIDResult {
  uuids: string[]
  count: number
}

/**
 * 生成单个 UUID v4
 * 使用原生 crypto.randomUUID() API
 */
export function generateUUID(): string {
  // 优先使用原生 API
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  
  // 降级方案（用于不支持的环境）
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  
  // 设置 UUID v4 版本和变体
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

/**
 * 批量生成 UUID
 * @param count 生成数量 (1-50)
 */
export function generateBatchUUID(count: number): BatchUUIDResult {
  const safeCount = Math.max(1, Math.min(50, count))
  
  const uuids: string[] = []
  for (let i = 0; i < safeCount; i++) {
    uuids.push(generateUUID())
  }
  
  return {
    uuids,
    count: safeCount,
  }
}
