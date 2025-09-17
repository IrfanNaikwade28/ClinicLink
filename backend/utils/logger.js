// Minimal logger that is silent by default. Enable with LOG_LEVEL=info|debug
const LEVEL = (process.env.LOG_LEVEL || 'silent').toLowerCase();
const IS_DEBUG = LEVEL === 'debug';
const IS_INFO = IS_DEBUG || LEVEL === 'info';

export const logInfo = (...args) => {
  if (IS_INFO) console.log(...args);
};

export const logError = (...args) => {
  if (IS_DEBUG) console.error(...args);
};

export default { logInfo, logError };
