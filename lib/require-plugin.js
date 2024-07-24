'use strict';

const _ = require('lodash');
const utils = require('./utils');

const isPluginNotFoundError = (e, pluginName) => {
    const pluginNameWithoutScope = pluginName.startsWith('@') ? pluginName.slice(pluginName.indexOf('/') + 1) : pluginName;
    const basePluginName = pluginNameWithoutScope.includes('/') ? pluginNameWithoutScope.slice(0, pluginNameWithoutScope.indexOf('/')) : pluginNameWithoutScope;
    if (e.toString().includes(`Error: Cannot find module '${pluginName}'`)) {
        return true;
    }
    // error from yarn + pnp
    if (new RegExp(`plugins-loader tried to access .*?${basePluginName}.*?, but it isn't declared in its dependencies`).test(e.toString())) {
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
        if (startsWithPrefix || !isPluginNotFoundError(e, pluginNameWithPrefix)) {
            throw e;
        }

        try {
            return utils.require(pluginName);
        } catch (e) {
            if (isPluginNotFoundError(e, pluginName)) {
                throw new Error(`Cannot find module '${pluginName}' or '${pluginNameWithPrefix}'`);
            }

            throw e;
        }
    }
};
