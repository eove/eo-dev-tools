import { extractChangelog } from './changelogParser';

describe('Changelog parser', () => {
  it('should return nothing if changelog empty', () => {
    const changelog = extractChangelog('', '1.0.0');

    expect(changelog).toEqual('');
  });

  it('should return changes for provided version', () => {
    const content = [
      '# Changelog',
      '',
      'All notable changes.',
      '',
      '## 1.0.0',
      '',
      '### Added',
      '',
      '- something',
    ].join('\n');

    const changelog = extractChangelog(content, '1.0.0');

    const expected = ['### Added', '', '- something'].join('\n');
    expect(changelog).toEqual(expected);
  });

  it('should return changes for provided version only', () => {
    const content = [
      '# Changelog',
      '',
      'All notable changes.',
      '',
      '## 3.0.0',
      '',
      '### Added',
      '',
      '- something in third version',
      '',
      '## 2.0.0',
      '',
      '### Added',
      '',
      '- something in second version',
      '',
      '## 1.0.0',
      '',
      '### Added',
      '',
      '- something in first version',
    ].join('\n');

    const changelog = extractChangelog(content, '2.0.0');

    const expected = ['### Added', '', '- something in second version'].join(
      '\n'
    );
    expect(changelog).toEqual(expected);
  });

  it('should return changes for a prefixed version by v', () => {
    const content = [
      '# Changelog',
      '',
      'All notable changes.',
      '',
      '## 1.0.0',
      '',
      'Something',
    ].join('\n');

    const changelog = extractChangelog(content, 'v1.0.0');

    expect(changelog).toEqual('Something');
  });

  it('should return changes for a prerelease version', () => {
    const content = [
      '# Changelog',
      '',
      'All notable changes.',
      '',
      '## 1.0.0',
      '',
      'Something',
    ].join('\n');

    const changelog = extractChangelog(content, '1.0.0-dev.3');

    expect(changelog).toEqual('Something');
  });
});