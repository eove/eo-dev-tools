import { createLogger as baseCreateLogger, Level, Logger } from '@arpinum/log';

interface Creation {
  level: Level;
}

export function createLogger(creation: Creation): Logger {
  return baseCreateLogger({
    level: creation.level,
    getLogInputs: ({ args }) => ['# ', ...args],
  });
}
