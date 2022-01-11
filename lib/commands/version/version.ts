import { Logger } from '@arpinum/log';
import { access, readdir, readFile } from 'fs/promises';
import { join as joinPath } from 'path';

import { Console } from '../../tools';

interface Creation {
  logger: Logger;
  console: Console;
}

export interface VersionOptions {
  rootDirectory: string;
}

interface Package {
  name: string;
  version: string;
}

export function createVersion(
  creation: Creation
): (options: VersionOptions) => Promise<void> {
  const { logger, console } = creation;
  return async (options: VersionOptions) => {
    const { rootDirectory } = options;
    logger.debug(`Printing version from ${rootDirectory}`);
    const packages = await findAllPackages(rootDirectory);
    print(packages);
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
    const packagesDirectory = joinPath(rootDirectory, 'packages');
    const directories = await findDirectories(packagesDirectory);
    return findNpmPackages(directories);
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
      const { version, name } = JSON.parse(packageJson) as any;
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

  function print(packages: Package[]): void {
    const message = packages
      .reduce((result, p) => {
        const { name, version } = p;
        result.push(`${name}: ${version}`);
        return result;
      }, [] as string[])
      .join('\n');
    console.log(message);
  }

  async function findDirectories(rootDirectory: string): Promise<string[]> {
    const files = await readdir(rootDirectory, { withFileTypes: true });
    return files
      .filter((entry) => entry.isDirectory)
      .map((entry) => joinPath(rootDirectory, entry.name));
  }
}
