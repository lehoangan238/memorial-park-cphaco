type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const isDev = import.meta.env.DEV

function shouldLog(level: LogLevel): boolean {
  if (isDev) return true
  return level === 'warn' || level === 'error'
}

export const logger = {
  debug: (...args: unknown[]) => {
    if (shouldLog('debug')) {
      console.debug(...args)
    }
  },
  info: (...args: unknown[]) => {
    if (shouldLog('info')) {
      console.info(...args)
    }
  },
  warn: (...args: unknown[]) => {
    if (shouldLog('warn')) {
      console.warn(...args)
    }
  },
  error: (...args: unknown[]) => {
    if (shouldLog('error')) {
      console.error(...args)
    }
  },
}
