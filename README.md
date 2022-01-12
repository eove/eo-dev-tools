# @eove/dev-tools

[![Build Status](https://github.com/eove/eo-dev-tools/workflows/CI/badge.svg)](https://github.com/eove/eo-dev-tools/actions?query=workflow%3ACI)

Collection of development scripts/tools for Eove applications.

## Installation from sources

```
git clone git@github.com:eove/eo-dev-tools.git
nvm install
npm install
```

## Usage from sources

Display help:

```
npm start -- --help
```

## Usage with a global package

Install package for your current node:

```
npm install -g @eove/dev-tools
```

Then show help:

```
eo-dev-tools --help
```

## Usage with npx

```
npx @eove/dev-tools --help
```

## Commands

- `changelog`: prints changes from a changelog file
- `version`: prints project version

## `changelog` command

### Examples

Extracts the changelog for provided version:

```
npx @eove/dev-tools changelog --file ./CHANGELOG.md 1.3.4
```

### Version detection

When `latest` is used and changelog is not empty, the first changes will be returned.

When provided version uses a `v` prefix (`v1.2.3`), it will be automatically omitted (`1.2.3` will be used).

When provided version is a prerelease (`1.2.3-dev.1`), this exact version will be looked for, then the release one (`1.2.3`).

## `version` command

### Examples

Extracts the changelog for provided version:

```
npx @eove/dev-tools version --root ~/sources/myproject
```

## License

[MIT](LICENSE)
