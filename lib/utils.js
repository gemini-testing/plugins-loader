'use strict';

// helper for convenient testing
exports.require = (name) => {
    const importedModule = require(name);

    return importedModule.__esModule ? importedModule.default : importedModule;
};
