import { join as joinPath } from 'path';

import { StandardStreams } from '../../tools';
import { createSilentLogger } from '../../tests';
import { ChangelogOptions, createChangelog } from './changelog';

describe('Changelog', () => {
  let standardStreams: StandardStreams;
  let logger;
  let command: (options: ChangelogOptions) => Promise<void>;

  beforeEach(() => {
    logger = createSilentLogger();
    standardStreams = { output: jest.fn() };
    command = createChangelog({ logger, standardStreams: standardStreams });
  });

  it('should print the changelog for given version', async () => {
    await command({
      file: joinPath(__dirname, 'tests/nominal.md'),
      changesVersion: '2.0.0',
      omitTitle: true,
    });

    const expected = ['### Added', '', '- something in 2.0.0'].join('\n');
    expect(standardStreams.output).toHaveBeenCalledWith(expected);
  });

  it('should print the changelog with title when needed', async () => {
    await command({
      file: joinPath(__dirname, 'tests/nominal.md'),
      changesVersion: '2.0.0',
      omitTitle: false,
    });

    const expected = [
      '## 2.0.0 - 2022-01-02',
      '',
      '### Added',
      '',
      '- something in 2.0.0',
    ].join('\n');
    expect(standardStreams.output).toHaveBeenCalledWith(expected);
  });

  it('should print another the changelog for another given version', async () => {
    await command({
      file: joinPath(__dirname, 'tests/nominal.md'),
      changesVersion: '2.1.1',
      omitTitle: true,
    });

    const expected = ['### Added', '', '- something in 2.1.1'].join('\n');
    expect(standardStreams.output).toHaveBeenCalledWith(expected);
  });

  it('should rejects when file does not exist', async () => {
    const file = joinPath(__dirname, 'tests/missing.md');

    const act = command({
      file,
      changesVersion: '2.0.0',
      omitTitle: true,
    });

    await expect(act).rejects.toThrow(
      `Cannot read provided changelog at ${file}`
    );
  });
});
