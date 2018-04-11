/**
 * Webpack 4 Config
 *
 * @link https://github.com/webpack/webpack
 * @see https://www.valentinog.com/blog/webpack-4-tutorial/#webpack_4_setting_up_webpack_4_with_React
 */
module.exports = {
    /**
     * need babel-polyfill for async/await to work in webpack/react
     * @see https://labs.chiedo.com/blog/regenerateruntime-error-in-react/
     */
    entry: ['babel-polyfill', './example/App.js'],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        plugins: ["transform-class-properties"]
                    }
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true,
                        },
                    },
                ],
            },
        ]
    },
    plugins: [

    ]
}
