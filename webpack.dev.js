const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = (env, options) => merge(common(env, options), {
    mode: "development",
    devtool: "source-map",
    plugins: [
        new webpack.DefinePlugin({
            "process.env.PROFILE": JSON.stringify("development")
        })
    ],
    devServer: {
        static: path.resolve("dist")
    },
});
