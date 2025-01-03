const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        main: './src/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist/scripts'),
        filename: '[name].js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader, 
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                type: 'asset/resource',
            },
            {
                test: /.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options:{
                        presets: [
                            "@babel/preset-env", 
                            ["@babel/preset-react", {"runtime": "automatic"}]
                        ],
                        plugins: ["@babel/plugin-transform-runtime"]
                    }
                },
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
               { from: "./public/scripts", to: path.resolve(__dirname, 'dist/scripts') },
               { from: "./public/icons", to: path.resolve(__dirname, 'dist/icons') },
               { from: "./public/index.html", to: path.resolve(__dirname, 'dist/index.html') },
               { from: "./public/manifest.json", to: path.resolve(__dirname, 'dist/manifest.json') },
               { from: "./node_modules/@unocss/runtime/uno.global.js", to: path.resolve(__dirname, 'dist/scripts/unocss/uno.global.js') },
               { from: "./src/uno.rules.js", to: path.resolve(__dirname, 'dist/scripts/unocss/uno.rules.js') },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: '../style/main.css'
        }),
    ],
    mode: 'development'
};