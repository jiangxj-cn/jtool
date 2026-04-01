/**
 * 时间戳转换工具
 */
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
/**
 * 时间戳转日期
 */
export function timestampToDate(timestamp, timezone = 'UTC') {
    const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
    return dayjs(ts).tz(timezone).format('YYYY-MM-DD HH:mm:ss');
}
/**
 * 日期转时间戳
 */
export function dateToTimestamp(date) {
    return dayjs(date).valueOf();
}
/**
 * 获取当前时间
 */
export function now() {
    const now = dayjs();
    return {
        timestamp: Math.floor(now.valueOf() / 1000),
        timestampMs: now.valueOf(),
        date: now.format('YYYY-MM-DD'),
        dateTime: now.format('YYYY-MM-DD HH:mm:ss'),
        iso: now.toISOString(),
    };
}
/**
 * 时间戳详情
 */
export function timestampDetail(timestamp) {
    const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
    const d = dayjs(ts);
    return {
        timestamp: Math.floor(ts / 1000),
        timestampMs: ts,
        date: d.format('YYYY-MM-DD'),
        dateTime: d.format('YYYY-MM-DD HH:mm:ss'),
        iso: d.toISOString(),
        timezone: 'UTC',
    };
}
