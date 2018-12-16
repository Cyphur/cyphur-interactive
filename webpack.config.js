const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackStylishPlugin = require('webpack-stylish');
const WebpackBarPlugin = require('webpackbar');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const devMode = true;

const optimization = {
    runtimeChunk: true,
    splitChunks: {
        cacheGroups: {
            utils: {
                chunks: 'all',
                test: /[\\/]node_modules[\\/](lodash|moment|moment-timezone)[\\/]/,
                name: 'vendor/utils'
            }
        }
    }
};

module.exports = {
    stats: 'minimal',
    mode: devMode ? 'development' : 'production',
    devtool: devMode ? 'cheap-module-source-map' : 'source-map',
    performance: { hints: false },
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ '@babel/preset-env' ]
                    }
                }
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            { test: /\.png$/, loader: 'file-loader' }
        ]
    },
    optimization: optimization,
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new CleanWebpackPlugin([ 'dist' ]),
        new CopyWebpackPlugin([ { from: 'src/img', to: 'img' } ]),
        new webpack.NamedModulesPlugin(),
        new WebpackBarPlugin(),
        new WebpackStylishPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new HtmlWebpackPlugin({
            title: 'Cyphur Interactive',
            favicon: 'favicon.ico',
            template: 'src/index.html',
            filename: 'index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        open: 'Chrome'
    }
};
