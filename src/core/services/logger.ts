type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
  context?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logLevel: LogLevel = this.isDevelopment ? "debug" : "info";

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: string,
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : "";
    return `${timestamp} [${level.toUpperCase()}]${contextStr} ${message}`;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return levels[level] >= levels[this.logLevel];
  }

  private log(
    level: LogLevel,
    message: string,
    data?: unknown,
    context?: string,
  ): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, context);
    const logEntry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      context,
    };

    switch (level) {
      case "debug":
        // eslint-disable-next-line no-console
        console.debug(formattedMessage, data);
        break;
      case "info":
        // eslint-disable-next-line no-console
        console.info(formattedMessage, data);
        break;
      case "warn":
        console.warn(formattedMessage, data);
        break;
      case "error":
        console.error(formattedMessage, data);
        break;
    }

    if (!this.isDevelopment && level === "error") {
      this.sendToErrorTracking(logEntry);
    }
  }

  private sendToErrorTracking(_logEntry: LogEntry): void {
    // TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
  }

  debug(message: string, data?: unknown, context?: string): void {
    this.log("debug", message, data, context);
  }

  info(message: string, data?: unknown, context?: string): void {
    this.log("info", message, data, context);
  }

  warn(message: string, data?: unknown, context?: string): void {
    this.log("warn", message, data, context);
  }

  error(message: string, data?: unknown, context?: string): void {
    this.log("error", message, data, context);
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}

export const logger = new Logger();
