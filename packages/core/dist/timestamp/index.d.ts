export interface TimestampResult {
    timestamp: number;
    timestampMs: number;
    date: string;
    dateTime: string;
    iso: string;
}
/**
 * 时间戳转日期
 */
export declare function timestampToDate(timestamp: number | string, timezone?: string): string;
/**
 * 日期转时间戳
 */
export declare function dateToTimestamp(date: string): number;
/**
 * 获取当前时间
 */
export declare function now(): TimestampResult;
/**
 * 时间戳详情
 */
export declare function timestampDetail(timestamp: number | string): TimestampResult & {
    timezone: string;
};
