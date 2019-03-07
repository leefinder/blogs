const webpack = require('webpack');
const path = require('path');
const BaseConfig = require('./webpack.base.conf');
const merge = require('webpack-merge');
const config = require('../config');
const devWebpackConfig = merge(BaseConfig, {
    devServer: {
        hot: true,
        host: config.dev.host,
        port: config.dev.port,
        open: config.dev.open,
        historyApiFallback: {
          rewrites: [
            { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') }
          ]
        },
        publicPath: config.dev.assetsPublicPath,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
})
module.exports = new Promise((res, rej) => {
    res(devWebpackConfig);
});
