/**
 * IP 网络计算器工具
 * 支持 IPv4 地址转换、子网掩码计算、CIDR 表示法等
 */

/**
 * IP 类型枚举
 */
export enum IPClass {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  Invalid = 'Invalid',
}

/**
 * IP 计算结果接口
 */
export interface IPCalculationResult {
  // 原始输入
  input: string
  
  // IP 地址各种格式
  decimal: string      // 十进制（点分十进制）
  binary: string       // 二进制
  hexadecimal: string  // 十六进制
  integer: number      // 整数形式
  
  // IP 类型
  ipClass: IPClass     // A/B/C/D/E 类
  isPrivate: boolean   // 是否私有地址
  isLoopback: boolean  // 是否回环地址
  
  // CIDR 相关
  cidr: number         // CIDR 前缀长度 (0-32)
  subnetMask: string   // 子网掩码（点分十进制）
  subnetMaskBinary: string // 子网掩码（二进制）
  
  // 网络信息
  networkAddress: string    // 网络地址
  broadcastAddress: string  // 广播地址
  firstHost: string         // 第一个可用 IP
  lastHost: string          // 最后一个可用 IP
  totalHosts: number        // 总主机数
  usableHosts: number       // 可用主机数
  
  // IP 范围
  ipRange: string           // IP 范围表示
}

/**
 * 将 IP 地址转换为整数
 */
export function ipToInt(ip: string): number {
  const parts = ip.split('.').map(Number)
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
    throw new Error('无效的 IP 地址格式')
  }
  return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3]
}

/**
 * 将整数转换为 IP 地址
 */
export function intToIp(int: number): string {
  return [
    (int >>> 24) & 0xff,
    (int >>> 16) & 0xff,
    (int >>> 8) & 0xff,
    int & 0xff,
  ].join('.')
}

/**
 * 将 IP 地址转换为二进制字符串
 */
export function ipToBinary(ip: string): string {
  const parts = ip.split('.').map(Number)
  return parts.map(p => p.toString(2).padStart(8, '0')).join('.')
}

/**
 * 将 IP 地址转换为十六进制字符串
 */
export function ipToHex(ip: string): string {
  const parts = ip.split('.').map(Number)
  return parts.map(p => p.toString(16).padStart(2, '0')).join('.')
}

/**
 * 判断 IP 地址类型（A/B/C/D/E 类）
 */
export function getIPClass(ip: string): IPClass {
  const firstOctet = parseInt(ip.split('.')[0])
  
  if (firstOctet >= 1 && firstOctet <= 126) return IPClass.A
  if (firstOctet >= 128 && firstOctet <= 191) return IPClass.B
  if (firstOctet >= 192 && firstOctet <= 223) return IPClass.C
  if (firstOctet >= 224 && firstOctet <= 239) return IPClass.D
  if (firstOctet >= 240 && firstOctet <= 255) return IPClass.E
  return IPClass.Invalid
}

/**
 * 判断是否为私有 IP 地址
 */
export function isPrivateIP(ip: string): boolean {
  const parts = ip.split('.').map(Number)
  const first = parts[0]
  const second = parts[1]
  
  // 10.0.0.0/8
  if (first === 10) return true
  
  // 172.16.0.0/12
  if (first === 172 && second >= 16 && second <= 31) return true
  
  // 192.168.0.0/16
  if (first === 192 && second === 168) return true
  
  return false
}

/**
 * 判断是否为回环地址
 */
export function isLoopbackIP(ip: string): boolean {
  return ip.startsWith('127.')
}

/**
 * 根据 CIDR 计算子网掩码
 */
export function cidrToSubnetMask(cidr: number): string {
  if (cidr < 0 || cidr > 32) {
    throw new Error('CIDR 值必须在 0-32 之间')
  }
  const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0
  return intToIp(mask)
}

/**
 * 根据子网掩码计算 CIDR
 */
export function subnetMaskToCidr(mask: string): number {
  const parts = mask.split('.').map(Number)
  let cidr = 0
  for (const part of parts) {
    let n = part
    while (n > 0) {
      cidr += n & 1
      n >>= 1
    }
  }
  return cidr
}

/**
 * 解析 CIDR 表示法（如 192.168.1.0/24）
 */
export function parseCIDR(cidrNotation: string): { ip: string; cidr: number } {
  const parts = cidrNotation.split('/')
  if (parts.length !== 2) {
    throw new Error('无效的 CIDR 表示法')
  }
  const ip = parts[0].trim()
  const cidr = parseInt(parts[1].trim())
  
  if (isNaN(cidr) || cidr < 0 || cidr > 32) {
    throw new Error('CIDR 值必须在 0-32 之间')
  }
  
  return { ip, cidr }
}

/**
 * 计算网络地址
 */
export function getNetworkAddress(ip: string, cidr: number): string {
  const ipInt = ipToInt(ip)
  const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0
  const networkInt = ipInt & mask
  return intToIp(networkInt)
}

/**
 * 计算广播地址
 */
export function getBroadcastAddress(ip: string, cidr: number): string {
  const ipInt = ipToInt(ip)
  const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0
  const networkInt = ipInt & mask
  const hostMask = ~mask >>> 0
  const broadcastInt = networkInt | hostMask
  return intToIp(broadcastInt)
}

/**
 * 计算第一个可用 IP
 */
export function getFirstHost(ip: string, cidr: number): string {
  if (cidr >= 31) {
    return getNetworkAddress(ip, cidr)
  }
  const networkInt = ipToInt(getNetworkAddress(ip, cidr))
  return intToIp(networkInt + 1)
}

/**
 * 计算最后一个可用 IP
 */
export function getLastHost(ip: string, cidr: number): string {
  if (cidr >= 31) {
    return getBroadcastAddress(ip, cidr)
  }
  const broadcastInt = ipToInt(getBroadcastAddress(ip, cidr))
  return intToIp(broadcastInt - 1)
}

/**
 * 计算可用主机数
 */
export function getUsableHosts(cidr: number): number {
  if (cidr >= 31) {
    return cidr === 31 ? 2 : 1
  }
  const hostBits = 32 - cidr
  return Math.pow(2, hostBits) - 2
}

/**
 * 计算总主机数
 */
export function getTotalHosts(cidr: number): number {
  const hostBits = 32 - cidr
  return Math.pow(2, hostBits)
}

/**
 * 验证 IP 地址格式
 */
export function isValidIP(ip: string): boolean {
  const parts = ip.split('.')
  if (parts.length !== 4) return false
  
  for (const part of parts) {
    const num = parseInt(part)
    if (isNaN(num) || num < 0 || num > 255) return false
    // 不允许前导零（除了 0 本身）
    if (part.length > 1 && part.startsWith('0')) return false
  }
  
  return true
}

/**
 * 主计算函数：计算 IP 网络信息
 */
export function calculateIP(input: string): IPCalculationResult {
  // 解析输入（支持 CIDR 表示法）
  let ip: string
  let cidr: number
  
  if (input.includes('/')) {
    const parsed = parseCIDR(input)
    ip = parsed.ip
    cidr = parsed.cidr
  } else {
    ip = input.trim()
    cidr = 24 // 默认 CIDR
  }
  
  // 验证 IP
  if (!isValidIP(ip)) {
    throw new Error('无效的 IP 地址格式')
  }
  
  const ipInt = ipToInt(ip)
  const subnetMask = cidrToSubnetMask(cidr)
  
  return {
    input: input.trim(),
    decimal: ip,
    binary: ipToBinary(ip),
    hexadecimal: ipToHex(ip).toUpperCase(),
    integer: ipInt,
    ipClass: getIPClass(ip),
    isPrivate: isPrivateIP(ip),
    isLoopback: isLoopbackIP(ip),
    cidr,
    subnetMask,
    subnetMaskBinary: ipToBinary(subnetMask),
    networkAddress: getNetworkAddress(ip, cidr),
    broadcastAddress: getBroadcastAddress(ip, cidr),
    firstHost: getFirstHost(ip, cidr),
    lastHost: getLastHost(ip, cidr),
    totalHosts: getTotalHosts(cidr),
    usableHosts: getUsableHosts(cidr),
    ipRange: `${getFirstHost(ip, cidr)} - ${getLastHost(ip, cidr)}`,
  }
}

/**
 * IP 格式转换
 */
export interface IPFormatConversion {
  decimal: string
  binary: string
  hexadecimal: string
  integer: number
}

export function convertIPFormat(ip: string): IPFormatConversion {
  if (!isValidIP(ip)) {
    throw new Error('无效的 IP 地址格式')
  }
  
  return {
    decimal: ip,
    binary: ipToBinary(ip),
    hexadecimal: ipToHex(ip).toUpperCase(),
    integer: ipToInt(ip),
  }
}
