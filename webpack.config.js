"use strict";

const path = require('path')

process.traceDeprecation = true

module.exports = {
    entry: {
        main: './examples/test.jsx'
        , main2: './examples/test-dom.jsx'
    }
    , output: {
        path: path.resolve(__dirname, 'examples')
        , filename: '[name].js'
        //, library: '[name]'
        //, libraryTarget: 'commonjs2'
    }
    , resolve: {
        extensions: ['.js', '.jsx', '.es6']
        , modules: [path.resolve(__dirname, "src"), "node_modules"]
    }
    , externals: {
        react: 'React'
        , 'react-dom': 'ReactDOM'
        , 'prop-types': 'PropTypes'
    }
    , module: {
        loaders: [{
            test: [/\.jsx$/, /\.es6$/]
            , exclude: [path.resolve(__dirname, 'node_modules')]
            , loader: 'babel-loader'
            , options: {
                comments: false
                , sourceMaps: true
                //, modules: 'umd'
            }
        }]
    }
    //, watch: true
    , target: 'web'
    , plugins: []
}

