'use strict';

const proxyquire = require('proxyquire');

describe('Loader', () => {
    const sandbox = sinon.sandbox.create();

    afterEach(() => sandbox.restore());

    describe('.load', () => {
        let requirePlugin;
        let Loader;

        beforeEach(() => {
            requirePlugin = sandbox.stub();

            Loader = proxyquire('../../lib/loader', {
                './require-plugin': requirePlugin.returns(() => {})
            });
        });

        it('should not load plugins with `false` value in opts', () => {
            const loader = Loader.create();

            assert.deepEqual(loader.load({'some-plugin': false}), []);
        });

        it('should load plugins with passed tool', () => {
            const loader = Loader.create();
            const plugin = sinon.stub();

            requirePlugin.returns(plugin);

            loader.load({'some-plugin': true})[0]('some-tool');

            assert.calledWith(plugin, 'some-tool');
        });

        it('should load plugins with `true` value in opts', () => {
            const loader = Loader.create();
            const plugin = sinon.stub();

            requirePlugin.returns(plugin);

            loader.load({'some-plugin': true})[0]();

            assert.calledWith(plugin, sinon.match.any, {});
        });

        it('should load plugins with custom opts', () => {
            const loader = Loader.create();
            const plugin = sinon.stub();

            requirePlugin.returns(plugin);

            loader.load({'some-plugin': {some: 'value'}})[0]();

            assert.calledWith(plugin, sinon.match.any, {some: 'value'});
        });

        it('should require plugins considering a passed prefix', () => {
            const loader = Loader.create('prefix-');

            loader.load({'some-plugin': true})[0]();

            assert.calledWith(requirePlugin, 'some-plugin', 'prefix-');
        });
    });
});
