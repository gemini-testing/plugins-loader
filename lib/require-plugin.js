'use strict';

const _ = require('lodash');
const utils = require('./utils');

const isPluginNotFoundError = (e) => {
    if (e.code === 'MODULE_NOT_FOUND') {
        return true;
    }
    return false;
};

module.exports = (pluginName, prefix) => {
    const startsWithPrefix = _.startsWith(pluginName, prefix);
    const pluginNameWithPrefix = startsWithPrefix ? pluginName : prefix + pluginName;

    try {
        return utils.require(pluginNameWithPrefix);
    } catch (e) {
        if (startsWithPrefix || !isPluginNotFoundError(e)) {
            throw e;
        }

        try {
            return utils.require(pluginName);
        } catch (e) {
            if (isPluginNotFoundError(e)) {
                throw new Error(`Cannot find module '${pluginName}' or '${pluginNameWithPrefix}'`, {cause: e});
            }

            throw e;
        }
    }
};
