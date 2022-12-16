const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = (env, options) => merge(common(env, options), {
    mode: "production",
    plugins: [
        new webpack.DefinePlugin({
            "process.env.PROFILE": JSON.stringify("production")
        })
    ],
});
