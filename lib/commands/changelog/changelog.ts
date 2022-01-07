import { Logger } from '@arpinum/log';
import { access, readFile } from 'fs/promises';

import { Console } from '../../tools';
import { extractChangelog } from './changelogParser';

interface Creation {
  logger: Logger;
  console: Console;
}

export interface ChangelogOptions {
  changesVersion: string;
  file: string;
}

export function createChangelog(
  creation: Creation
): (options: ChangelogOptions) => Promise<void> {
  const { logger, console } = creation;
  return async (options: ChangelogOptions) => {
    const { file: filePath, changesVersion: version } = options;
    logger.debug(`Extracting version ${version} changelog from ${filePath}`);
    await ensureChangelogExists(filePath);
    const content = await readFile(filePath, { encoding: 'utf8' });
    const result = extractChangelog(content, version);
    console.log(result);
  };
}

async function ensureChangelogExists(filePath: string): Promise<void> {
  try {
    await access(filePath);
  } catch (error) {
    throw new Error(`Cannot read provided changelog at ${filePath}`);
  }
}
