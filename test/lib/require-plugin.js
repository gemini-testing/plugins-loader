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

    it('should throw if a plugin which starts with prefix was not found', () => {
        utils.require
            .withArgs('prefix-some-plugin')
            .throws(new Error('Error: Cannot find module \'prefix-some-plugin\''));

        assert.throws(() => requirePlugin('prefix-some-plugin', 'prefix'),
            'Cannot find module \'prefix-some-plugin\'');
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

    it('should require a plugin without prefix', () => {
        utils.require
            .withArgs('prefix-some-plugin')
            .throws(new Error('Cannot find module \'prefix-some-plugin\''));

        utils.require.withArgs('some-plugin').returns(() => true);

        assert.isTrue(requirePlugin('some-plugin', 'prefix-')());
    });

    it('should throw if a plugin without prefix contains an error', () => {
        const error = new Error();

        utils.require
            .withArgs('prefix-some-plugin')
            .throws(new Error('Cannot find module \'prefix-some-plugin\''));

        utils.require.withArgs('some-plugin').throws(error);

        assert.throws(() => requirePlugin('some-plugin', 'prefix-'), error);
    });

    it('should throw if a plugin with prefix and a plugin without prefix were not found', () => {
        utils.require
            .withArgs('prefix-some-plugin')
            .throws(new Error('Cannot find module \'prefix-some-plugin\''));

        utils.require
            .withArgs('some-plugin')
            .throws(new Error('Cannot find module \'some-plugin\''));

        assert.throws(() => requirePlugin('some-plugin', 'prefix-'),
            'Cannot find module \'some-plugin\' or \'prefix-some-plugin\'');
    });
});
