'use strict';

const requirePlugin = require('../../lib/require-plugin');
const utils = require('../../lib/utils');

describe('require-plugin', () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(() => sandbox.stub(utils, 'require'));

    afterEach(() => sandbox.restore());

    it('should require a plugin which starts with prefix', () => {
        utils.require.withArgs('prefix-some-plugin').returns(() => true);

        assert.isTrue(requirePlugin('prefix-some-plugin', 'prefix-')());
    });

    it('should throw if a plugin which starts with prefix contains an error', () => {
        const error = new Error();

        utils.require.withArgs('prefix-some-plugin').throws(error);

        assert.throws(() => requirePlugin('prefix-some-plugin', 'prefix-'), error);
    });

    it('should require a plugin which does not start with prefix', () => {
        utils.require.withArgs('prefix-some-plugin').returns(() => true);

        assert.isTrue(requirePlugin('some-plugin', 'prefix-')());
    });

    it('should throw if a plugin which does not start with prefix contains an error', () => {
        const error = new Error();

        utils.require.withArgs('prefix-some-plugin').throws(error);

        assert.throws(() => requirePlugin('some-plugin', 'prefix-'), error);
    });

    [
        {name: 'npm', mkError: pluginName => new Error(`Cannot find module '${pluginName}'`)},
        {name: 'yarn+pnp', mkError: pluginName => new Error(`plugins-loader tried to access ${pluginName}, but it isn't declared in its dependencies`)}
    ].forEach(({name, mkError}) => {
        describe(`using '${name}' package manager`, () => {
            it('should throw if a plugin which starts with prefix was not found', () => {
                const pluginName = 'prefix-some-plugin';
                const error = mkError(pluginName);

                utils.require.withArgs(pluginName).throws(error);

                assert.throws(() => requirePlugin(pluginName, 'prefix'), error);
            });

            it('should require a plugin without prefix', () => {
                const pluginName = 'prefix-some-plugin';
                const error = mkError(pluginName);

                utils.require.withArgs(pluginName).throws(error);
                utils.require.withArgs('some-plugin').returns(() => true);

                assert.isTrue(requirePlugin('some-plugin', 'prefix-')());
            });

            it('should throw if a plugin without prefix contains an error', () => {
                const pluginName = 'prefix-some-plugin';
                const errorWithPrefix = mkError(pluginName);
                const errorWithouPrefix = new Error();

                utils.require.withArgs(pluginName).throws(errorWithPrefix);
                utils.require.withArgs('some-plugin').throws(errorWithouPrefix);

                assert.throws(() => requirePlugin('some-plugin', 'prefix-'), errorWithouPrefix);
            });

            it('should throw if a plugin with prefix and a plugin without prefix were not found', () => {
                const pluginNameWithPrefix = 'prefix-some-plugin';
                const errorWithPrefix = mkError(pluginNameWithPrefix);

                const pluginNameWithoutPrefix = 'some-plugin';
                const errorWithoutPrefix = mkError(pluginNameWithoutPrefix);

                utils.require
                    .withArgs(pluginNameWithPrefix)
                    .throws(errorWithPrefix);

                utils.require
                    .withArgs(pluginNameWithoutPrefix)
                    .throws(errorWithoutPrefix);

                assert.throws(() => requirePlugin(pluginNameWithoutPrefix, 'prefix-'),
                    `Cannot find module '${pluginNameWithoutPrefix}' or '${pluginNameWithPrefix}'`);
            });
        });
    });
});
