import glob from 'glob';
import { Logger } from '@arpinum/log';
import { access, readFile } from 'fs/promises';
import { promisify } from 'util';
import { join as joinPath } from 'path';

import { StandardStreams } from '../../tools';

const globAsync = promisify(glob);

interface Creation {
  logger: Logger;
  standardStreams: StandardStreams;
}

export interface VersionOptions {
  rootDirectory: string;
  markdown: boolean;
}

interface Package {
  name: string;
  version: string;
}

interface PackageJson {
  name: string;
  version: string;
}

interface LernaJson {
  packages: string[];
}

export function createVersion(
  creation: Creation
): (options: VersionOptions) => Promise<void> {
  const { logger, standardStreams } = creation;
  return async (options: VersionOptions) => {
    const { rootDirectory, markdown } = options;
    logger.debug(`Printing version from ${rootDirectory}`);
    const packages = await findAllPackages(rootDirectory);
    print(packages, markdown);
  };

  async function findAllPackages(rootDirectory: string): Promise<Package[]> {
    if (await isLernaProject(rootDirectory)) {
      logger.debug('Project is managed by lerna');
      return findLernaPackages(rootDirectory);
    }
    if (await isNpmPackage(rootDirectory)) {
      const npmPackage = await findNpmPackage(rootDirectory);
      return npmPackage ? [npmPackage] : [];
    }
    return [];
  }

  async function isLernaProject(rootDirectory: string): Promise<boolean> {
    try {
      await access(joinPath(rootDirectory, 'lerna.json'));
      return true;
    } catch (error) {
      return false;
    }
  }

  async function findLernaPackages(rootDirectory: string): Promise<Package[]> {
    const lernaConfiguration = await readFile(
      joinPath(rootDirectory, 'lerna.json'),
      { encoding: 'utf8' }
    );
    const { packages } = JSON.parse(lernaConfiguration) as LernaJson;
    const directories = await findDirectories(rootDirectory, packages);
    return findNpmPackages(directories);
  }

  async function findDirectories(
    rootDirectory: string,
    globs: string[]
  ): Promise<string[]> {
    const directories = [];
    for (const glob of globs) {
      const currentDirectories = await globAsync(glob, {
        absolute: true,
        cwd: rootDirectory,
      });
      directories.push(...currentDirectories);
    }
    return Array.from(new Set(directories));
  }

  async function findNpmPackages(directories: string[]): Promise<Package[]> {
    const result: Package[] = [];
    for (const directory of directories) {
      const npmPackage = await findNpmPackage(directory);
      if (npmPackage) {
        result.push(npmPackage);
      }
    }
    return result;
  }

  async function findNpmPackage(
    rootDirectory: string
  ): Promise<Package | undefined> {
    if (await isNpmPackage(rootDirectory)) {
      logger.debug(`Npm project found at ${rootDirectory}`);
      const packageJson = await readFile(
        joinPath(rootDirectory, 'package.json'),
        {
          encoding: 'utf8',
        }
      );
      const { version, name } = JSON.parse(packageJson) as PackageJson;
      return { version, name };
    }
    return undefined;
  }

  async function isNpmPackage(rootDirectory: string): Promise<boolean> {
    try {
      await access(joinPath(rootDirectory, 'package.json'));
      return true;
    } catch (error) {
      return false;
    }
  }

  function print(packages: Package[], markdown: boolean): void {
    const message = markdown
      ? createMarkdownMessage(packages)
      : createPlainMessage(packages);
    standardStreams.output(message);
  }

  function createPlainMessage(packages: Package[]): string {
    if (packages.length === 0) {
      return 'No version available';
    }
    return packages
      .reduce((result, p) => {
        const { name, version } = p;
        result.push(`${name}: ${version}`);
        return result;
      }, [] as string[])
      .join('\n');
  }

  function createMarkdownMessage(packages: Package[]): string {
    if (packages.length === 0) {
      return ['### Package version', '', 'None available'].join('\n');
    }
    const title = packages.length > 1 ? 'Packages versions' : 'Package version';
    return packages
      .reduce(
        (result, p) => {
          const { name, version } = p;
          result.push(`- ${name}: ${version}`);
          return result;
        },
        [`### ${title}`, '']
      )
      .join('\n');
  }
}
