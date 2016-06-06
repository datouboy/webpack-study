module.exports = {
    entry: "./src/entry.js",
    output: {
        path: "./dist/js",
        filename: "bundle.js"
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?t=1464255832[path][name].[ext]'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader!jsx-loader?harmony'
            }, {
                test: /\.jsx$/,
                loader: 'babel-loader!jsx-loader?harmony'
            }
        ]
    }
};