var path = require('path');
var DtsBundlePlugin = require('./dts-bundle-plugin');

var plugins = [];
plugins.push(new DtsBundlePlugin({ name: 'robokit-cli' }));

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [{
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: "source-map-loader",
                exclude: /(node_modules)/
            }
        ]
    },
    plugins: plugins,
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'robokit-cli',
        libraryTarget: "umd",
        umdNamedDefine: true,
        globalObject: 'typeof self !== \'undefined\' ? self : this' // fixes a webpack 4 bug: https://github.com/webpack/webpack/issues/6784
    },
    devtool: "source-map",
}