'use strict';

const utils = require('./utils');

const isPluginNotFoundError = (e, pluginName) =>
    e.toString().includes(`Error: Cannot find module '${pluginName}'`);

module.exports = (pluginName, prefix) => {
    try {
        return utils.require(pluginName);
    } catch (e) {
        if (!isPluginNotFoundError(e, pluginName)) {
            throw e;
        }

        const pluginNameWithPrefix = prefix + pluginName;

        try {
            return utils.require(pluginNameWithPrefix);
        } catch (e) {
            if (isPluginNotFoundError(e, pluginNameWithPrefix)) {
                throw new Error(`Can not find module '${pluginName}' or '${pluginNameWithPrefix}'`);
            }

            throw e;
        }
    }
};
