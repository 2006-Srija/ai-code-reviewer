const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

class Logger {
  constructor(level = 'info') {
    this.level = levels[level];
  }

  debug(...args) {
    if (this.level <= levels.debug) {
      console.log('🔍 DEBUG:', ...args);
    }
  }

  info(...args) {
    if (this.level <= levels.info) {
      console.log('ℹ️ INFO:', ...args);
    }
  }

  warn(...args) {
    if (this.level <= levels.warn) {
      console.log('⚠️ WARN:', ...args);
    }
  }

  error(...args) {
    if (this.level <= levels.error) {
      console.log('❌ ERROR:', ...args);
    }
  }
}

export default new Logger(process.env.LOG_LEVEL || 'info');