const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env) => ({
    entry: path.resolve("./src/index.js"),
    plugins: [
        new HtmlWebpackPlugin({
            title: `${env.title}`,
            template: "./src/index.html"
        })
    ],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [ "@babel/preset-env" ]
                    }
                }
            },
            {
                test: /(font|styles).*\.css$/i,
                use: [ "style-loader", "css-loader" ],
            },
            {
                test: /assets.*\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
            {
                test: /assets.*\.(mp3|m4a|ogg)$/i,
                type: "asset/resource",
            },
            {
                test: /assets.*\.(json|atlas)$/i,
                type: "asset/resource",
            },
        ]
    },
    output: {
        filename: "[name].[contenthash:8].js",
        assetModuleFilename: "resource/[name].[contenthash:8][ext][query]",
        path: path.resolve("dist"),
        clean: true
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        }
    },
});
