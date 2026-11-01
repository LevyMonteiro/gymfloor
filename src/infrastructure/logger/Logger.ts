export type LogLevel = 'info' | 'warn' | 'error' | 'success'

export interface LogPayload {
  level: LogLevel
  category: string
  message: string
  details?: any
  stack?: string
}

export class Logger {
  private static send(payload: LogPayload) {
    const { level, category, message, details, stack } = payload

    // 1. Browser DevTools Console
    const prefix = `[${level.toUpperCase()}][${category}]`
    if (level === 'error') {
      console.error(prefix, message, details || '', stack || '')
    } else if (level === 'warn') {
      console.warn(prefix, message, details || '')
    } else {
      console.log(prefix, message, details || '')
    }

    // 2. Relay directly to Vite Dev Server Terminal (only when running in actual browser, not in tests)
    const isTest =
      typeof import.meta !== 'undefined' &&
      (import.meta as any).env &&
      (import.meta as any).env.MODE === 'test'

    if (
      !isTest &&
      typeof window !== 'undefined' &&
      typeof window.location !== 'undefined' &&
      window.location.protocol.startsWith('http')
    ) {
      try {
        fetch('/__terminal_log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            level,
            category,
            message,
            details: details
              ? typeof details === 'object'
                ? JSON.parse(JSON.stringify(details, Object.getOwnPropertyNames(details)))
                : String(details)
              : undefined,
            stack,
          }),
        }).catch(() => {
          // Silently ignore if server endpoint is unavailable
        })
      } catch {
        // Silently ignore
      }
    }
  }

  static info(category: string, message: string, details?: any) {
    this.send({ level: 'info', category, message, details })
  }

  static warn(category: string, message: string, details?: any) {
    this.send({ level: 'warn', category, message, details })
  }

  static success(category: string, message: string, details?: any) {
    this.send({ level: 'success', category, message, details })
  }

  static error(category: string, message: string, error?: any) {
    let stack = ''
    let details: any = error

    if (error instanceof Error) {
      stack = error.stack || ''
      details = {
        name: error.name,
        message: error.message,
        cause: (error as any).cause,
      }
    }

    this.send({ level: 'error', category, message, details, stack })
  }

  static init() {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.error('UNCAUGHT_WINDOW_ERROR', event.message, {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
        })
      })

      window.addEventListener('unhandledrejection', (event) => {
        const reason = event.reason
        this.error(
          'UNHANDLED_PROMISE_REJECTION',
          reason?.message || String(reason),
          reason instanceof Error ? { stack: reason.stack } : reason
        )
      })

      this.info('SYSTEM', 'Logger do Gymfloor inicializado com envio para o terminal.')
    }
  }
}
