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
  let parsingRelevantLines = false;
  for (const line of allLines) {
    if (line.startsWith('## ')) {
      const versionMaybe = getVersionMaybe(line);
      parsingRelevantLines = versionMaybe === versionToUse;
      if (!omitTitle && parsingRelevantLines) {
        relevantLines.push(line);
      }
    } else if (parsingRelevantLines) {
      relevantLines.push(line);
    }
  }
  return relevantLines.join('\n').trim();
}

function getVersionMaybe(line: string) {
  const regex = /(\d+\.\d+\.\d+)/;
  const matches = regex.exec(line);
  if (!matches) {
    return null;
  }
  return matches[1];
}

function getVersionToUse(version: string) {
  const regex = /v?(\d+\.\d+\.\d+)(-.*)?/;
  const matches = regex.exec(version);
  if (!matches) {
    return version;
  }
  return matches[1];
}
