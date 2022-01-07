import yargs from 'yargs';
import { Level as LogLevel } from '@arpinum/log';

import { changelog } from './commands';

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  yargs
    .command(changelog)
    .demandCommand()
    .options({
      logLevel: {
        alias: 'log',
        type: 'string',
        description: 'Log level',
        default: LogLevel.info,
      },
    })
    .detectLocale(false)
    .parse();
}
