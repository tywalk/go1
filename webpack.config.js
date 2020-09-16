const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = async (env, options) => {
    const dev = options.mode === "development";
    const config = {
        mode: options.mode,
        devtool: "source-map",
        entry: {
            app: [
                'react-hot-loader/patch',
                './src/client/index.tsx'
            ],
            polyfill: "@babel/polyfill"
        },
        node: {
            fs: "empty",
            net: "empty"
        },
        output: {
            path: path.resolve(__dirname, './src/build')
            // publicPath: '/'
        },
        resolve: {
            extensions: [".ts", ".tsx", ".html", ".js"],
            plugins: [new TsconfigPathsPlugin({ configFile: "./src/client/tsconfig.json" })]
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
            new CleanWebpackPlugin(),
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
        ]
    };

    return config;
};