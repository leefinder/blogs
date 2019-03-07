'use strict';
const path = require('path');
const resolve = (dir) => {
  return path.resolve(__dirname, '..', dir);
};
module.exports = {
  dev: {
    host: 'localhost',
    port: 8090,
    open: false,
    devtool: 'cheap-module-eval-source-map',
    assetsPublicPath: '/',
    assetsRoot: resolve('dist')
  },
  build: {
    assetsPublicPath: '/',
    devtool: 'source-map',
  }
};