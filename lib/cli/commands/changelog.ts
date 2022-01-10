import { CommandModule } from 'yargs';

import { createLogger } from '../../tools';
import { createChangelog, ChangelogOptions } from '../../commands';
import { GlobalOptions } from './types';

interface Options extends GlobalOptions, ChangelogOptions {}

export const changelog: CommandModule<any, Options> = {
  command: 'changelog [changesVersion]',
  describe: 'Print changelog for given version',
  builder: (yargs) => {
    yargs.positional('changesVersion', {
      type: 'string',
      description: 'The version containing changelog',
      default: 'latest',
    });
    yargs.options({
      file: {
        type: 'string',
        description: 'Changelog file path',
        default: './CHANGELOG.md',
      },
      omitTitle: {
        type: 'boolean',
        description: 'Omit title usually containing version and release date',
        default: false,
      },
    });
    return yargs;
  },
  handler: (argv) => {
    const logger = createLogger({ level: argv.logLevel });
    const command = createChangelog({ logger, console });
    return command(argv);
  },
};
