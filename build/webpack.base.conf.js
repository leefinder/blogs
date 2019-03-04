const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const resolve = (dir) => {
    return path.resolve(__dirname, '..', dir)
}
const entry = () => {
    const entries = {}
    const root = [
        {
            name: 'promise',
            path: 'js-think/promise/index.js'
        }
    ]
    root.forEach(item => {
        entries[item.name] = resolve(item.path);
    })
    return entries;
}
const config = {
    entry,
    output: {
        path: resolve('dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve('./index.html'),
            filename: 'index.html'
        })
    ]
}
module.exports = config;