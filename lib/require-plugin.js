'use strict';

const _ = require('lodash');
const utils = require('./utils');

const isPluginNotFoundError = (e, pluginName) => {
    const pluginNameWithoutScope = pluginName.startsWith('@') ? pluginName.slice(pluginName.indexOf('/') + 1) : pluginName;
    const basePluginName = pluginNameWithoutScope.includes('/') ? pluginNameWithoutScope.slice(pluginNameWithoutScope.indexOf('/') + 1) : pluginNameWithoutScope;
    return [
        new RegExp(`Error: Cannot find module '${pluginName}'`),
        // error from yarn + pnp
        new RegExp(`plugins-loader tried to access .*?${basePluginName}.*?, but it isn't declared in its dependencies`)
    ].some(notFoundErr => notFoundErr.test(e));
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
