/**
 * 二维码生成工具
 */
import QRCode from 'qrcode'

export interface QRCodeOptions {
  width?: number
  margin?: number
  color?: {
    dark: string
    light: string
  }
}

/**
 * 生成二维码 DataURL
 */
export async function generateQRCode(
  text: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const { width = 300, margin = 2, color = { dark: '#000000', light: '#ffffff' } } = options
  
  try {
    return await QRCode.toDataURL(text, {
      width,
      margin,
      color: {
        dark: color.dark,
        light: color.light,
      },
    })
  } catch (error) {
    throw new Error('二维码生成失败')
  }
}

/**
 * 生成二维码 Canvas（仅浏览器）
 */
export function generateQRCodeCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  options: QRCodeOptions = {}
): Promise<void> {
  const { width = 300, margin = 2 } = options
  
  return QRCode.toCanvas(canvas, text, {
    width,
    margin,
  })
}
