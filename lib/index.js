'use strict';

const Loader = require('./loader');

exports.load = (tool, plugins, prefix) =>
    Loader
        .create(prefix)
        .load(plugins)
        .map((plugin) => plugin(tool));
