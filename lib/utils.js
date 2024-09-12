'use strict';

// helper for convenient testing
exports.require = (name) => {
    const defaultPathsToResolve = require.resolve.paths(name);
    const absoluteModulePath = require.resolve(name, {paths: [process.cwd(), ...defaultPathsToResolve]});
    const importedModule = require(absoluteModulePath);

    return importedModule.__esModule ? importedModule.default : importedModule;
};
