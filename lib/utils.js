'use strict';

// helper for convenient testing
exports.require = (name) => {
    const importedModule = require(require.resolve(name, {paths: [process.cwd()]})); // Require module using the absolute path

    return importedModule.__esModule ? importedModule.default : importedModule;
};
