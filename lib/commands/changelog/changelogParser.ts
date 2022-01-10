import { VersionName } from './versionName';

export interface ExtractChangelogOptions {
  omitTitle: boolean;
}

interface ChangesForVersions {
  versions: string[];
  lines: string[];
}

export function extractChangelog(
  content: string,
  version: string,
  options: ExtractChangelogOptions
): string {
  const { omitTitle } = options;
  const allChanges = indexChangesPerVersions(content);
  const relevantChanges = findRelevantChanges(allChanges, version);
  const relevantLines = relevantChanges ? relevantChanges.lines : [];
  const withoutTitleMaybe =
    omitTitle && relevantLines.length > 0
      ? relevantLines.slice(1)
      : relevantLines;
  return withoutTitleMaybe.join('\n').trim();
}

function indexChangesPerVersions(content: string): ChangesForVersions[] {
  return content.split('\n').reduce(
    (result, line) => {
      if (line.startsWith('## ')) {
        result.currentChanges = {
          versions: getVersionsFromLine(line),
          lines: [line] as string[],
        };
        result.allChanges.push(result.currentChanges);
      } else {
        if (result.currentChanges && result.currentChanges.lines) {
          result.currentChanges.lines.push(line);
        }
      }
      return result;
    },
    {
      currentChanges: undefined as ChangesForVersions | undefined,
      allChanges: [] as ChangesForVersions[],
    }
  ).allChanges;
}

function findRelevantChanges(
  allChanges: ChangesForVersions[],
  version: string
): ChangesForVersions | undefined {
  if (allChanges.length === 0) {
    return undefined;
  }
  if (version === VersionName.latest) {
    return allChanges[0];
  }
  for (const versionToFind of getVersionsToFind(version)) {
    const changesForVersion = allChanges.find((indexedChanges) =>
      indexedChanges.versions.includes(versionToFind)
    );
    if (changesForVersion) {
      return changesForVersion;
    }
  }
  return undefined;
}

function getVersionsFromLine(line: string): string[] {
  const regex = /(\d+\.\d+\.\d+(-[\w.]*)?)/g;
  return Array.from(line.matchAll(regex), (m) => m[0]);
}

function getVersionsToFind(version: string): string[] {
  const versionWithoutPrefix = getVersionWithoutPrefix(version);
  const versionWithoutPrerelease =
    getVersionWithoutPrerelease(versionWithoutPrefix);
  const result = [versionWithoutPrefix];
  if (versionWithoutPrefix !== versionWithoutPrerelease) {
    result.push(versionWithoutPrerelease);
  }
  return result;
}

function getVersionWithoutPrefix(version: string): string {
  return version.startsWith('v') ? version.slice(1) : version;
}

function getVersionWithoutPrerelease(version: string): string {
  const startOfPrerelease = version.indexOf('-');
  return startOfPrerelease !== -1
    ? version.slice(0, startOfPrerelease)
    : version;
}
