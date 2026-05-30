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
  private constructor(private readonly testName: string) {}

  static forTest(testName: string): TestLogger {
    return new TestLogger(testName);
  }

  step(message: string, data?: Record<string, unknown>): void {
    TestLogger.staticStep(message, data, this.testName);
  }

  request(method: string, url: string, body?: unknown): void {
    TestLogger.staticRequest(method, url, body, this.testName);
  }

  response(status: number, body?: unknown): void {
    TestLogger.staticResponse(status, body, this.testName);
  }

  error(message: string, error?: unknown): void {
    TestLogger.staticError(message, error, this.testName);
  }

  debug(message: string, data?: Record<string, unknown>): void {
    TestLogger.staticDebug(message, data, this.testName);
  }

  static step(message: string, data?: Record<string, unknown>): void {
    TestLogger.staticStep(message, data);
  }

  static request(method: string, url: string, body?: unknown): void {
    TestLogger.staticRequest(method, url, body);
  }

  static response(status: number, body?: unknown): void {
    TestLogger.staticResponse(status, body);
  }

  static error(message: string, error?: unknown): void {
    TestLogger.staticError(message, error);
  }

  static debug(message: string, data?: Record<string, unknown>): void {
    TestLogger.staticDebug(message, data);
  }

  private static ctx(testName?: string): string {
    return testName ? ` - ${testName} - ` : ' ';
  }

  private static staticStep(
    message: string,
    data?: Record<string, unknown>,
    testName?: string,
  ): void {
    logger.info(`[STEP]${TestLogger.ctx(testName)}${message}`, data);
  }

  private static staticRequest(
    method: string,
    url: string,
    body?: unknown,
    testName?: string,
  ): void {
    logger.info(
      `[REQ]${TestLogger.ctx(testName)}${method} ${url}`,
      body !== undefined ? { body } : undefined,
    );
  }

  private static staticResponse(status: number, body?: unknown, testName?: string): void {
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
    logger.log(
      level,
      `[RES]${TestLogger.ctx(testName)}${status}`,
      body !== undefined ? { body } : undefined,
    );
  }

  private static staticError(message: string, error?: unknown, testName?: string): void {
    if (error instanceof Error) {
      logger.error(`[ERR]${TestLogger.ctx(testName)}${message}`, {
        error: error.message,
        stack: error.stack,
      });
    } else {
      logger.error(
        `[ERR]${TestLogger.ctx(testName)}${message}`,
        error !== undefined ? { error } : undefined,
      );
    }
  }

  private static staticDebug(
    message: string,
    data?: Record<string, unknown>,
    testName?: string,
  ): void {
    logger.debug(`${TestLogger.ctx(testName)}${message}`, data);
  }
}

export default logger;
