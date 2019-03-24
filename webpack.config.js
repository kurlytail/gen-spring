/* eslint-disable no-console */

const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const pkg = require('./package.json');

const isProd = process.env.NODE_ENV === 'production';
const isDebug = process.env.NODE_ENV === 'debug';
const isDist = isDebug || isProd ? '.min' : '';
const distPath = path.join(__dirname, 'dist');
const showConfigOnly = '1' === process.env.SHOW_CONFIG_ONLY || 'true' === process.env.SHOW_CONFIG_ONLY;

const config = {
    output: {
        filename: `[name]${isDist}.js`,
        path: distPath,
        pathinfo: !isProd,
        libraryTarget: 'commonjs2'
    },

    devtool: 'inline-source-map',

    resolve: {
        extensions: ['.js'],
        modules: ['node_modules', 'src']
    },

    plugins: [
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: false
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(isProd ? 'production' : 'development')
            },
            'app.version': JSON.stringify(pkg.version)
        })
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                use: [
                    'source-map-loader',
                    {
                        loader: 'eslint-loader',
                        options: {
                            emitWarning: true
                        }
                    }
                ]
            },
            {
                exclude: /node_modules/,
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    },

    target: 'node'
};

if (isProd) {
    config.plugins.push(new UglifyJsPlugin({ sourceMap: true }));
}

// If ran with SHOW_CONFIG_ONLY=1|true, only show the config and exit cleanly
if (showConfigOnly) {
    console.log(chalk.black.bgYellow.bold('Showing Configuration Only:'));
    console.log(require('util').inspect(config, false, null));
    process.exit(0);
}

const configLib = Object.assign({}, config, {
    externals: [nodeExternals()],
    entry: {
        spring: './src/js/index.js'
    }
});

module.exports = [configLib];
