const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
/*
const HtmlWebpackPlugin = require('html-webpack-plugin');
*/

/*
const ENV = process.env.NODE_ENV;
switch (ENV) {
    case 'production':
        break;
    case 'production':
        break;
    case 'production':
        break;
}
*/

module.exports = {
    mode: 'production',
    entry: {
        app: './index.js'
    },
    /*
    devtool: 'inline-source-map',
     */
    plugins: [
        new CleanWebpackPlugin(['dist/bundle']),
        /*
        new HtmlWebpackPlugin({title: 'hjs-collection'})
        */
    ],
    output: {
        path: path.resolve(__dirname, 'dist/bundle'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(dist|lib|node_modules|test)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    stats: {
        colors: true
    }
};
