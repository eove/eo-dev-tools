import { join as joinPath } from 'path';

import { StandardStreams } from '../../tools';
import { createSilentLogger } from '../../tests';
import { VersionOptions, createVersion } from './version';

describe('Version', () => {
  let standardStreams: StandardStreams;
  let logger;
  let command: (options: VersionOptions) => Promise<void>;

  beforeEach(() => {
    logger = createSilentLogger();
    standardStreams = { output: jest.fn() };
    command = createVersion({ logger, standardStreams: standardStreams });
  });

  describe('when project is managed by lerna', () => {
    it('should print version for each package', async () => {
      await command(
        createOptions({
          rootDirectory: joinPath(__dirname, 'tests', 'lerna'),
        })
      );

      const expected = ['package-a: 1.0.1', 'package-b: 1.0.2'].join('\n');
      expect(standardStreams.output).toHaveBeenCalledWith(expected);
    });

    it('should print version for each package using markdown if needed', async () => {
      await command(
        createOptions({
          rootDirectory: joinPath(__dirname, 'tests', 'lerna'),
          markdown: true,
        })
      );

      const expected = [
        '### Packages versions',
        '',
        '- package-a: 1.0.1',
        '- package-b: 1.0.2',
      ].join('\n');
      expect(standardStreams.output).toHaveBeenCalledWith(expected);
    });

    it('should find all packages based on lerna configuration', async () => {
      await command(
        createOptions({
          rootDirectory: joinPath(__dirname, 'tests', 'lerna-complex'),
        })
      );

      const expected = [
        'package-a: 1.0.1',
        'package-b: 1.0.2',
        'package-c: 1.0.3',
      ].join('\n');
      expect(standardStreams.output).toHaveBeenCalledWith(expected);
    });

    it('should find all packages without duplicates based on lerna configuration', async () => {
      await command(
        createOptions({
          rootDirectory: joinPath(__dirname, 'tests', 'lerna-dup'),
        })
      );

      expect(standardStreams.output).toHaveBeenCalledWith('package: 1.0.1');
    });

    it('should omit non-npm package', async () => {
      await command(
        createOptions({
          rootDirectory: joinPath(__dirname, 'tests', 'lerna-mixed'),
        })
      );

      expect(standardStreams.output).toHaveBeenCalledWith('package-a: 1.0.1');
    });
  });

  describe('when project is a npm package', () => {
    it('should print version for it', async () => {
      await command(
        createOptions({ rootDirectory: joinPath(__dirname, 'tests', 'npm') })
      );

      expect(standardStreams.output).toHaveBeenCalledWith('package: 1.0.0');
    });

    it('should print version as markdown when needed', async () => {
      await command(
        createOptions({
          rootDirectory: joinPath(__dirname, 'tests', 'npm'),
          markdown: true,
        })
      );

      const expected = ['### Package version', '', '- package: 1.0.0'].join(
        '\n'
      );
      expect(standardStreams.output).toHaveBeenCalledWith(expected);
    });
  });

  describe('when project is unknown', () => {
    it('should print no version available', async () => {
      await command(
        createOptions({ rootDirectory: joinPath(__dirname, 'tests', 'empty') })
      );

      expect(standardStreams.output).toHaveBeenCalledWith(
        'No version available'
      );
    });

    it('should print no version available as markdown when needed', async () => {
      await command(
        createOptions({
          rootDirectory: joinPath(__dirname, 'tests', 'empty'),
          markdown: true,
        })
      );

      const expected = ['### Package version', '', 'None available'].join('\n');
      expect(standardStreams.output).toHaveBeenCalledWith(expected);
    });
  });

  function createOptions(
    options: Partial<VersionOptions> = {}
  ): VersionOptions {
    return Object.assign({ rootDirectory: '', markdown: false }, options);
  }
});
