/**
 * Centralized Logging Service
 * Provides consistent logging across the application with environment-aware behavior
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: string;
    data?: unknown;
    error?: Error;
}

class Logger {
    private isDevelopment = import.meta.env.DEV;

    private formatEntry(entry: LogEntry): string {
        const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
        const context = entry.context ? ` [${entry.context}]` : '';
        return `${prefix}${context} ${entry.message}`;
    }

    private createEntry(
        level: LogLevel,
        message: string,
        context?: string,
        data?: unknown,
        error?: Error
    ): LogEntry {
        return {
            level,
            message,
            timestamp: new Date().toISOString(),
            context,
            data,
            error,
        };
    }

    private log(entry: LogEntry): void {
        // In production, you might want to send logs to a service
        // For now, we only log in development for debug/info
        const formatted = this.formatEntry(entry);

        switch (entry.level) {
            case 'debug':
                if (this.isDevelopment) {
                    console.debug(formatted, entry.data ?? '');
                }
                break;
            case 'info':
                if (this.isDevelopment) {
                    console.info(formatted, entry.data ?? '');
                }
                break;
            case 'warn':
                console.warn(formatted, entry.data ?? '');
                break;
            case 'error':
                console.error(formatted, entry.error ?? entry.data ?? '');
                // In production, you could send to error tracking service here
                // Example: sendToErrorTracking(entry);
                break;
        }
    }

    debug(message: string, context?: string, data?: unknown): void {
        this.log(this.createEntry('debug', message, context, data));
    }

    info(message: string, context?: string, data?: unknown): void {
        this.log(this.createEntry('info', message, context, data));
    }

    warn(message: string, context?: string, data?: unknown): void {
        this.log(this.createEntry('warn', message, context, data));
    }

    error(message: string, context?: string, error?: Error | unknown): void {
        const errorObj = error instanceof Error ? error : undefined;
        this.log(this.createEntry('error', message, context, error, errorObj));
    }
}

// Export singleton instance
export const logger = new Logger();

// Export class for testing purposes
export { Logger };
