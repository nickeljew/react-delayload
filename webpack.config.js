var webpack = require('webpack')
var path = require("path")
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin


module.exports = {
    entry: {
        delayload: './src/delayload'
    }
    , output: {
        path: path.resolve('dist')
        , filename: '[name].js'
        , library: '[name].lib.js'
        , libraryTarget: 'commonjs2'
    }
    , resolve: {
        extensions: ['', '.js', '.jsx']
        , root: path.resolve('src')
        , modulesDirectories: ['node_modules', 'src']
    }
    , externals: {
        react: 'react'
    }
    , module: {
        loaders: [{
            test: /\.jsx$/
            , exclude: [path.resolve('node_modules')]
            , loader: 'babel'
            , query: {
                comments: false
                //, modules: 'umd'
                , moduleIds: true
                , getModuleId: function(moduleName) {
                    if (moduleName.match(/\/delayload$/)) {
                        return 'react-delayload'
                    }
                    return false
                }
                //, sourceMaps: true
                //, code: false
            }
        }]
    }
    , watch: true
    , plugins: [
        //new CommonsChunkPlugin('common.js')
    ]
}
