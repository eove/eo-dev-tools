import { CommandModule } from 'yargs';
import { createLogger } from '@arpinum/log';

import { createSayHello, SayHelloOptions } from '../../commands';
import { GlobalOptions } from './types';

interface Options extends GlobalOptions, SayHelloOptions {}

export const sayHello: CommandModule<any, Options> = {
  command: 'say-hello',
  describe: 'Say hello',
  handler: (argv) => {
    const logger = createLogger({ level: argv.logLevel });
    const command = createSayHello({ logger });
    return command(argv);
  },
};
