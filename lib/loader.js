'use strict';

const _ = require('lodash');
const requirePlugin = require('./require-plugin');

module.exports = class Loader {
    static create(prefix) {
        return new Loader(prefix);
    }

    constructor(prefix) {
        this._prefix = prefix;
    }

    load(plugins) {
        return _(plugins)
            .map((opts, name) => ({name, opts: opts === true ? {} : opts}))
            .reject((plugin) => plugin.opts === false)
            .map((plugin) => (tool) => requirePlugin(plugin.name, this._prefix)(tool, plugin.opts))
            .value();
    }
};
