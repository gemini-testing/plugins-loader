# plugins-loader [![Build Status](https://travis-ci.org/gemini-testing/plugins-loader.svg?branch=master)](https://travis-ci.org/gemini-testing/plugins-loader)

Plugins loader for [gemini](https://github.com/gemini-testing/gemini) and [hermione](https://github.com/gemini-testing/hermione).

## Install

```bash
$ npm install plugins-loader
```

## Usage

```js
const pluginsLoader = require('plugins-loader');

// gemini
pluginsLoader.load(gemini, gemini.config.system.plugins, 'gemini-');

// hermione
pluginsLoader.load(hermione, hermione.config.plugins, 'hermione-');
```
