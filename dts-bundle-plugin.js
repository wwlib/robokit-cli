var path = require('path');

class DtsBundlePlugin {

    constructor(options) {
        this.options = options || {};
        this.options.name = options.name || 'undefined';
        this.options.main = options.main || 'lib/index.d.ts';
        this.options.out = options.out || 'dist/index.d.ts';
    }

    apply(compiler) {
        compiler.hooks.done.tap('Dts Bundle Plugin', (
            stats /* stats is passed as argument when done hook is tapped.  */
        ) => {
            var dts = require('dts-bundle');
            console.log('DtsBundlePlugin: options: ', this.options);
            var name = this.options.name;
            var main = path.resolve(__dirname, this.options.main);
            var out = path.resolve(__dirname, this.options.out);
            dts.bundle({
                name: name,
                main: main,
                out: out,
                removeSource: false,
                outputAsModuleFolder: false,
                externals: false,
                referenceExternals: false,
                verbose: false
            });
        });
    }
}

module.exports = DtsBundlePlugin;