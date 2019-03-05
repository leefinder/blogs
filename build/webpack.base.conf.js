const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const root = require('../config/entries');
const resolve = (dir) => {
    return path.resolve(__dirname, '..', dir)
}

const entry = () => {
    const entries = {}
    root.forEach(item => {
        entries[item.name] = resolve(item.path);
    })
    return entries;
}
const htmlPlugins = () => {
    return root.map(item => new HtmlWebpackPlugin({
        template: resolve('index.html'),
        filename: `${item.name}.html`,
        chunks: [item.name],
        inject: true
    }))
}
const config = {
    entry,
    output: {
        path: resolve('dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    plugins: [
        ...htmlPlugins(),
        new CleanWebpackPlugin([resolve('dist')], {
            root: resolve('../')
        })
    ],
    optimization: {
        minimize: false,
        splitChunks: {
            chunks: "async",  //  async
            minSize: 400,
            automaticNameDelimiter: '~',
        }
    }
}
module.exports = config;