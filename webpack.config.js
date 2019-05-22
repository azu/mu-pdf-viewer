const path = require("path");

module.exports = {
    entry: [
        "./src/index.js"
    ],
    devtool: process.env.WEBPACK_DEVTOOL || "source-map",
    output: {
        path: path.join(__dirname, "public", "build"),
        publicPath: "/build/",
        filename: "bundle.js"
    },
    target: "electron-renderer",
    module: {
        // to avoid warning by power-assert-formatter
        exprContextCritical: false,
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true
                    }
                }
            }, {
                test: /\.css/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {url: false}
                    }
                ]
            }
        ]
    }
};
