import { CommandModule } from 'yargs';

import { createLogger } from '../../tools';
import { createVersion, VersionOptions } from '../../commands';
import { GlobalOptions } from './types';

interface Options extends GlobalOptions, VersionOptions {}

export const version: CommandModule<any, Options> = {
  command: 'version',
  describe: 'Print project version',
  builder: (yargs) => {
    yargs.options({
      rootDirectory: {
        alias: 'root',
        type: 'string',
        description: 'Project root directory',
        default: process.cwd(),
      },
    });
    return yargs;
  },
  handler: (argv) => {
    const logger = createLogger({ level: argv.logLevel });
    const command = createVersion({ logger, console });
    return command(argv);
  },
};
