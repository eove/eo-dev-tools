import { createLogger as baseCreateLogger, Logger } from '@arpinum/log';

export function createSilentLogger(options = {}): Logger {
  return baseCreateLogger(
    Object.assign({ level: process.env.TEST_LOGGER_LEVEL || 'off' }, options)
  );
}
