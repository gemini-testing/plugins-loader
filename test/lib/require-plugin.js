'use strict';

const requirePlugin = require('../../lib/require-plugin');
const utils = require('../../lib/utils');

describe('require-plugin', () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(() => sandbox.stub(utils, 'require'));

    afterEach(() => sandbox.restore());

    it('should require plugin', () => {
        utils.require.withArgs('some-plugin').returns(() => true);

        assert.isTrue(requirePlugin('some-plugin')());
    });

    it('should throw if plugin contains an error', () => {
        const error = new Error();

        utils.require.withArgs('some-plugin').throws(error);

        assert.throws(() => requirePlugin('some-plugin'), error);
    });

    it('should require plugin with prefix', () => {
        utils.require
            .withArgs('some-plugin').throws(new Error('Error: Cannot find module \'some-plugin\''))
            .withArgs('prefix-some-plugin').returns(() => true);


        assert.isTrue(requirePlugin('some-plugin', 'prefix-')());
    });

    it('should throw if plugin with prefix contains an error', () => {
        const error = new Error();

        utils.require
            .withArgs('some-plugin').throws(new Error('Error: Cannot find module \'some-plugin\''))
            .withArgs('prefix-some-plugin').throws(error);

        assert.throws(() => requirePlugin('some-plugin', 'prefix-'), error);
    });

    it('should throw if plugin does not exist', () => {
        utils.require
            .withArgs('some-plugin').throws(new Error('Error: Cannot find module \'some-plugin\''))
            .withArgs('prefix-some-plugin').throws(new Error('Error: Cannot find module \'prefix-some-plugin\''));

        assert.throws(() => requirePlugin('some-plugin', 'prefix-'),
            'Can not find module \'some-plugin\' or \'prefix-some-plugin\'');
    });
});
