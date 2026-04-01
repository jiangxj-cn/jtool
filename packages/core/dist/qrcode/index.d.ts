export interface QRCodeOptions {
    width?: number;
    margin?: number;
    color?: {
        dark: string;
        light: string;
    };
}
/**
 * 生成二维码 DataURL
 */
export declare function generateQRCode(text: string, options?: QRCodeOptions): Promise<string>;
/**
 * 生成二维码 Canvas（仅浏览器）
 */
export declare function generateQRCodeCanvas(canvas: HTMLCanvasElement, text: string, options?: QRCodeOptions): Promise<void>;
