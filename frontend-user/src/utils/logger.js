import config from '../config'

const logger = {
  log(...args) {
    if (config.log.enabled) {
      console.log('[LOG]', ...args)
    }
  },
  
  warn(...args) {
    if (config.log.enabled) {
      console.warn('[WARN]', ...args)
    }
  },
  
  error(...args) {
    // 错误日志始终输出
    console.error('[ERROR]', ...args)
  }
}

export default logger
