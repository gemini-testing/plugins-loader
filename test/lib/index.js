'use strict';

const Loader = require('../../lib/loader');
const pluginsLoader = require('../../lib');

describe('plugins-loader', () => {
    const sandbox = sinon.sandbox.create();

    afterEach(() => sandbox.restore());

    describe('.load', () => {
        beforeEach(() => {
            sandbox.spy(Loader, 'create');
            sandbox.stub(Loader.prototype, 'load').returns([]);
        });

        it('should create instance of "Loader" with appropriate prefix', () => {
            pluginsLoader.load(null, null, 'prefix-');

            assert.calledOnce(Loader.create);
            assert.calledWith(Loader.create, 'prefix-');
        });

        it('should load plugins', () => {
            const plugins = {'some-plugin': true, 'another-plugin': true};

            pluginsLoader.load(null, plugins);

            assert.calledOnce(Loader.prototype.load);
            assert.calledWith(Loader.prototype.load, plugins);
        });

        it('should call loaded plugins', () => {
            const pluginFn = sinon.spy();

            Loader.prototype.load.returns([pluginFn]);

            pluginsLoader.load('some-tool');

            assert.calledOnce(pluginFn);
            assert.calledWith(pluginFn, 'some-tool');
        });
    });
});
