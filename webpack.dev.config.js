const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: 'development',
    devtool: "source-map",
    entry: {
        app: [
            'react-hot-loader/patch',
            './src/client/index.tsx',
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'
        ],
        polyfill: "@babel/polyfill"
    },
    node: {
        fs: "empty",
        net: "empty",
        __dirname: false
    },
    output: {
        path: path.resolve(__dirname, './src/build'),
        publicPath: '/'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".html", ".js"],
        plugins: [new TsconfigPathsPlugin({ configFile: "src/client/tsconfig.json" })]
    },
    optimization: {
        splitChunks: {
          // include all types of chunks
          chunks: 'all'
        }
    },
    // context: path.join(__dirname, 'src'),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    'react-hot-loader/webpack',
                    'ts-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.s?css$/,
                use: [
                    "style-loader",
                    "css-loader", {
                        loader: "sass-loader", options: {
                            sassOptions: {
                                includePaths: []
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                use: {
                    loader: 'file-loader',
                    query: {
                        name: 'public/assets/[name].[ext]'
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({ verbose: true }),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('[name].[hash].css'),
        new HtmlWebpackPlugin({
            cache: false,
            filename: "views/index.html",
            template: './src/client/views/index.html',
            chunks: ['app', 'polyfills']
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './src/client/public',
                    globOptions: {
                        ignore: ['*.scss']
                    },
                    to: 'public',
                }
            ]
        }),
        new webpack.ProvidePlugin({
            Promise: ["es6-promise", "Promise"]
        })
    ],
    devServer: {
        hot: true,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        publicPath: path.join(__dirname, 'src/build'),
        // contentBasePublicPath: '/build/',
        contentBase: './build',
        // https: (options.https !== undefined) ? options.https : await devCerts.getHttpsServerOptions(),
        // port: process.env.npm_package_config_dev_server_port || 3000
    }
};