const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const root = require('../config/entries');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

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
        title: `${item.name}`,
        template: resolve(`${item.template ? item.template : 'index.html'}`),
        filename: `${item.name}.html`,
        chunks: [item.name],
        inject: true,
        paths: root
    }))
}
const config = {
    entry,
    output: {
        path: resolve('dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        }
    },
    plugins: [
        ...htmlPlugins(),
        new HtmlWebpackPlugin({
            template: resolve('index.html'),
            filename: `index.html`,
            paths: root,
            inject: false,
        }),
        new CleanWebpackPlugin([resolve('dist')], {
            root: resolve('../')
        }),
        new VueLoaderPlugin()
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