import { VersionName } from './versionName';

export interface ExtractChangelogOptions {
  omitTitle: boolean;
}

export function extractChangelog(
  content: string,
  version: string,
  options: ExtractChangelogOptions
): string {
  const { omitTitle } = options;
  const versionToUse = getVersionToUse(version);
  const allLines = content.split('\n');
  const relevantLines = [];
  let changesIndex;
  let parsingRelevantLines = false;
  for (const line of allLines) {
    if (line.startsWith('## ')) {
      changesIndex = changesIndex != undefined ? changesIndex + 1 : 0;
      parsingRelevantLines = isTitleRelevantForVersion(
        line,
        versionToUse,
        changesIndex
      );
      if (!omitTitle && parsingRelevantLines) {
        relevantLines.push(line);
      }
    } else if (parsingRelevantLines) {
      relevantLines.push(line);
    }
  }
  return relevantLines.join('\n').trim();
}

function isTitleRelevantForVersion(
  line: string,
  version: string,
  changesIndex: number
): boolean {
  const versionsInLine = getVersionsFromLine(line);
  return (
    versionsInLine.includes(version) ||
    (version === VersionName.latest && changesIndex === 0)
  );
}

function getVersionsFromLine(line: string): string[] {
  const regex = /(\d+\.\d+\.\d+)/g;
  return Array.from(line.matchAll(regex), (m) => m[0]);
}

function getVersionToUse(version: string) {
  const regex = /v?(\d+\.\d+\.\d+)(-.*)?/;
  const matches = regex.exec(version);
  if (!matches) {
    return version;
  }
  return matches[1];
}
