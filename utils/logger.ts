import winston from 'winston';

const logDir = 'logs';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
          return `${timestamp} [${level}]: ${message}${metaStr}`;
        }),
      ),
    }),
    new winston.transports.File({
      dirname: logDir,
      filename: 'combined.log',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.File({
      dirname: logDir,
      filename: 'error.log',
      level: 'error',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
});

export class TestLogger {
  static step(message: string, data?: Record<string, unknown>): void {
    logger.info(`[STEP] ${message}`, data);
  }

  static request(method: string, url: string, body?: unknown): void {
    logger.info(`[REQ] ${method} ${url}`, body !== undefined ? { body } : undefined);
  }

  static response(status: number, body?: unknown): void {
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
    logger.log(level, `[RES] ${status}`, body !== undefined ? { body } : undefined);
  }

  static error(message: string, error?: unknown): void {
    if (error instanceof Error) {
      logger.error(`[ERR] ${message}`, { error: error.message, stack: error.stack });
    } else {
      logger.error(`[ERR] ${message}`, error !== undefined ? { error } : undefined);
    }
  }

  static debug(message: string, data?: Record<string, unknown>): void {
    logger.debug(message, data);
  }
}

export default logger;
