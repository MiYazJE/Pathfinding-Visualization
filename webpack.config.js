const path = require('path');

module.exports = {
    entry: ['@babel/polyfill', './src/index.js'],
    output: {
        path: path.join(__dirname, '/public/'),
        filename: 'babel.js'
    },
    module: {
        rules: [
            {
                use: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader" // creates style nodes from JS strings
                    },
                    {
                        loader: "css-loader" // translates CSS into CommonJS
                    }
                ]
            }
        ]
    }
}