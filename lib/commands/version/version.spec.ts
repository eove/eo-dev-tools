import { join as joinPath } from 'path';

import { Console } from '../../tools';
import { createSilentLogger } from '../../tests';
import { VersionOptions, createVersion } from './version';

describe('Version', () => {
  let console: Console;
  let logger;
  let command: (options: VersionOptions) => Promise<void>;

  beforeEach(() => {
    logger = createSilentLogger();
    console = { log: jest.fn() };
    command = createVersion({ logger, console });
  });

  describe('when project is managed by lerna', () => {
    it('should print version for each package', async () => {
      await command({ rootDirectory: joinPath(__dirname, 'tests', 'lerna') });

      const expected = ['package-a: 1.0.1', 'package-b: 1.0.2'].join('\n');
      expect(console.log).toHaveBeenCalledWith(expected);
    });

    it('should omit non-npm package', async () => {
      await command({
        rootDirectory: joinPath(__dirname, 'tests', 'lerna-mixed'),
      });

      expect(console.log).toHaveBeenCalledWith('package-a: 1.0.1');
    });
  });

  describe('when project is a npm package', () => {
    it('should print version for it', async () => {
      await command({ rootDirectory: joinPath(__dirname, 'tests', 'npm') });

      expect(console.log).toHaveBeenCalledWith('package: 1.0.0');
    });
  });
});
