import { Logger } from '@arpinum/log';

interface Creation {
  logger: Logger;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SayHelloOptions {}

export function createSayHello(
  creation: Creation
): (options: SayHelloOptions) => Promise<void> {
  const { logger } = creation;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return async (_options: SayHelloOptions) => {
    logger.info('Hello');
  };
}
