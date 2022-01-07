import { join as joinPath } from 'path';

import { Console } from '../../tools';
import { createSilentLogger } from '../../tests';
import { ChangelogOptions, createChangelog } from './changelog';

describe('Changelog', () => {
  let console: Console;
  let logger;
  let command: (options: ChangelogOptions) => Promise<void>;

  beforeEach(() => {
    logger = createSilentLogger();
    console = { log: jest.fn() };
    command = createChangelog({ logger, console });
  });

  it('should print the changelog for given version', async () => {
    await command({
      file: joinPath(__dirname, 'tests/nominal.md'),
      changesVersion: '2.0.0',
    });

    const expected = ['### Added', '', '- something in 2.0.0'].join('\n');
    expect(console.log).toHaveBeenCalledWith(expected);
  });

  it('should print another the changelog for another given version', async () => {
    await command({
      file: joinPath(__dirname, 'tests/nominal.md'),
      changesVersion: '2.1.1',
    });

    const expected = ['### Added', '', '- something in 2.1.1'].join('\n');
    expect(console.log).toHaveBeenCalledWith(expected);
  });

  it('should rejects when file does not exist', async () => {
    const file = joinPath(__dirname, 'tests/missing.md');

    const act = command({
      file,
      changesVersion: '2.0.0',
    });

    await expect(act).rejects.toThrow(
      `Cannot read provided changelog at ${file}`
    );
  });
});
