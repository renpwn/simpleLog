export type LogLevel = 'log' | 'debug' | 'info' | 'warn' | 'error' | 'silent';

export interface LogStyle {
  color?: string | number | [number, number, number];
  bg?: string | number | [number, number, number];
  bold?: boolean;
  dim?: boolean;
}

export type ProgressStyle =
  | LogStyle
  | 'auto'
  | [LogStyle | null, LogStyle]
  | null;

export interface TimeOptions {
  locale?: 'id' | 'en';
  position?: 'prefix' | 'suffix';
  template?: string;
}

export interface TruncateOptions {
  enabled?: boolean;
  maxLength?: number;
}

export interface FileOptions {
  path?: string;
  format?: 'txt' | 'json';
  backup?: boolean;
}

export interface ProgressTheme {
  size?: number;
  filled?: string;
  empty?: string;
  left?: string;
  right?: string;
  style?: LogStyle | null;
}

export type ProgressSlot = string | [string, ProgressStyle];

export interface ProgressOptions {
  slots?: ProgressSlot[];
  theme?: ProgressTheme;
}

export interface LoggerOptions {
  level?: LogLevel;
  color?: boolean;
  time?: boolean | TimeOptions;
  truncate?: TruncateOptions;
  maxLength?: number;
  file?: FileOptions;
  progress?: ProgressOptions;
}

export class Logger {
  level: LogLevel;
  color: boolean;
  tty: boolean;
  time: boolean;

  constructor(opts?: LoggerOptions);

  allow(type: LogLevel): boolean;
  style(type: LogLevel, user?: LogStyle): LogStyle;

  update(name: string, cur: number, total: number, text?: string): void;
  remove(name: string): void;
  updateProgress(name: string, cur: number, total: number, text?: string): void;
  removeProgress(name: string): void;

  clearProgress(): void;
  renderProgress(): void;

  write(type: LogLevel, args: any[], style?: LogStyle): void;

  log(...args: any[]): void;
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}

export const LEVELS: Record<LogLevel, number>;
export const LEVEL_STYLE: Record<string, LogStyle>;

export function formatTime(opts?: {
  locale?: 'id' | 'en';
  date?: Date;
  template?: string;
}): string;

export function format(text: string, style?: LogStyle, tty?: boolean): string;

export function simpleLog(options?: LoggerOptions): Logger;
export default simpleLog;
