'use strict';

const _ = require('lodash');
const utils = require('./utils');

const isPluginNotFoundError = (e, pluginName) =>
    e.toString().includes(`Error: Cannot find module '${pluginName}'`);

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
