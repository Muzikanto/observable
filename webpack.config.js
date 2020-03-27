const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const mode = 'production';

const entry = {
    index: path.resolve('src/index.ts'),
};

const optimization = {
    minimizer: [
        new TerserPlugin({
            terserOptions: {
                keep_classnames: true,
                parse: {
                    ecma: 8,
                },
                compress: {
                    ecma: 6,
                    warnings: false,
                    comparisons: false,
                    inline: 2,
                },
                output: {
                    ecma: 6,
                    comments: false,
                    ascii_only: true,
                },
            },
            parallel: true,
            cache: true,
            sourceMap: true,
        }),
    ],
};

const plugins = [new webpack.NamedModulesPlugin(), new webpack.NoEmitOnErrorsPlugin()];

module.exports = {
    resolve: {
        modules: ['node_modules'],
        extensions: ['.ts', '.js', '.json'],
    },
    bail: true,
    mode,
    entry,
    optimization,
    output: {
        publicPath: './',
        path: path.resolve('build'),
        filename: '[name].js',
        libraryTarget: 'commonjs2',
    },
    target: 'node',
    node: {
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: 'ts-loader',
            },
        ],
    },
    plugins,
};
