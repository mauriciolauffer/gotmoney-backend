const logger = {
  info: (message: any, ...args: any[]) => console.log(`[INFO] ${message}`, ...args),
  error: (message: any, ...args: any[]) => console.error(`[ERROR] ${message}`, ...args),
  debug: (message: any, ...args: any[]) => console.debug(`[DEBUG] ${message}`, ...args),
  warn: (message: any, ...args: any[]) => console.warn(`[WARN] ${message}`, ...args),
  stream: {
    write: (message: string) => console.log(message.trim()),
  },
};

export default logger;
