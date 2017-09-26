const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './test/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '/dist')
    },

    devServer: { disableHostCheck: true },
    devtool: 'source-map',
    resolve: { extensions: ['.ts', '.tsx', '.js', '.json']},

    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                modules: true,
                                localIdentName: '[name]__[local]___[hash:base64:5]'
                            }
                        },
                        'postcss-loader'
                    ]
                })
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                modules: true,
                                sourceMap: true,
                                importLoaders: 2,
                                localIdentName: '[name]__[local]___[hash:base64:5]'
                            }
                        },
                        'sass-loader'
                    ]
                })
            }

        ]
    },

    // externals: {
    //     'react': 'React',
    //     'react-dom': 'ReactDOM'
    // },

    plugins: [
        new ExtractTextPlugin("style.css"),
        new HtmlWebpackPlugin({
            template: 'test/index.html',
            inject: true
        })
    ]
};