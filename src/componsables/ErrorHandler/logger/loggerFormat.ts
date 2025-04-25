/**
 * @description 日志格式化模块
 * @author FluffyChi-Xing
 */

export const LOGGER_PREFIX: string = '[renren:engine]';

export const LOGGER_FORMAT: string = (error) => `${LOGGER_PREFIX}-${new Date().toLocaleString()}:${error}`;
