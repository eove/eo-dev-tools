import { extractChangelog } from './changelogParser';
import { VersionName } from './versionName';

describe('Changelog parser', () => {
  it('should return nothing if changelog empty', () => {
    const changelog = extractChangelog('', '1.0.0', { omitTitle: false });

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

    const changelog = extractChangelog(content, '1.0.0', { omitTitle: true });

    const expected = ['### Added', '', '- something'].join('\n');
    expect(changelog).toEqual(expected);
  });

  it('should return changes with title when not omitted', () => {
    const content = [
      '# Changelog',
      '',
      'All notable changes.',
      '',
      '## 1.0.0 - 2022-01-01',
      '',
      'Something',
    ].join('\n');

    const changelog = extractChangelog(content, '1.0.0', { omitTitle: false });

    const expected = ['## 1.0.0 - 2022-01-01', '', 'Something'].join('\n');
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

    const changelog = extractChangelog(content, '2.0.0', { omitTitle: true });

    const expected = ['### Added', '', '- something in second version'].join(
      '\n'
    );
    expect(changelog).toEqual(expected);
  });

  it('should return changes for provided version only though some versions components have multiple digits', () => {
    const content = [
      '# Changelog',
      '',
      'All notable changes.',
      '',
      '## 1.1.12',
      '',
      'Something in second version',
      '',
      '## 1.1.11',
      '',
      '### Added',
      '',
      'Something in first version',
    ].join('\n');

    const changelog = extractChangelog(content, '1.1.12', {
      omitTitle: true,
    });

    const expected = ['Something in second version'].join('\n');
    expect(changelog).toEqual(expected);
  });

  it('should return changes for latest version when provided version is latest', () => {
    const content = [
      '# Changelog',
      '',
      'All notable changes.',
      '',
      '## 2.0.0',
      '',
      'Something in second version',
      '',
      '## 1.0.0',
      '',
      '### Added',
      '',
      'Something in first version',
    ].join('\n');

    const changelog = extractChangelog(content, VersionName.latest, {
      omitTitle: true,
    });

    const expected = ['Something in second version'].join('\n');
    expect(changelog).toEqual(expected);
  });

  it('won\'t return changes when title includes ambiguous latest word when provided version is latest', () => {
    const content = [
      '# Changelog',
      '',
      'All notable changes.',
      '',
      '## 2.0.0',
      '',
      'Something in second version',
      '',
      '## 1.0.0 is not the latest version',
      '',
      '### Added',
      '',
      'Something in first version',
    ].join('\n');

    const changelog = extractChangelog(content, VersionName.latest, {
      omitTitle: true,
    });

    const expected = ['Something in second version'].join('\n');
    expect(changelog).toEqual(expected);
  });

  it('should return changes for provided version only though some versions start identically', () => {
    const content = [
      '# Changelog',
      '',
      'All notable changes.',
      '',
      '## 1.1.12',
      '',
      'Something',
    ].join('\n');

    const changelog = extractChangelog(content, '1.1.1', {
      omitTitle: true,
    });

    expect(changelog).toEqual('');
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

    const changelog = extractChangelog(content, 'v1.0.0', { omitTitle: true });

    expect(changelog).toEqual('Something');
  });

  it('should return changes for a version though title contains multiple versions', () => {
    const content = [
      '# Changelog',
      '',
      'All notable changes.',
      '',
      '## 1.0.0, 1.0.1',
      '',
      'Something',
    ].join('\n');

    const changelog1 = extractChangelog(content, '1.0.0', { omitTitle: true });
    const changelog2 = extractChangelog(content, '1.0.1', { omitTitle: true });

    expect(changelog1).toEqual('Something');
    expect(changelog2).toEqual('Something');
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

    const changelog = extractChangelog(content, '1.0.0-dev.3', {
      omitTitle: true,
    });

    expect(changelog).toEqual('Something');
  });
});
