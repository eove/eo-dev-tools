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

- `changelog`: extracts changes from a changelog file

## Examples

### Changelog

Extracts the changelog for provided version:

```
npx @eove/dev-tools changelog --file ./CHANGELOG.md 1.3.4
```

## License

[MIT](LICENSE)
