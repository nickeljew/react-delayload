"use strict";

var webpack_dev = require('./webpack.config')
var extend = require('util')._extend

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
        , tag: {
            banner: '/*!\n'
            + ' * <%= pkg.name %>\n'
            + ' * @version <%= pkg.version %>\n'
            + ' */\n'
        }
        , concat: {
            options: {
                separator: '\n\n'
            }
            , dist: {
                files: {}
            }
        }
        , uglify: {
            common: {
                options: {
                    banner: '<%= tag.banner %>'
                    , mangle : {
                        except : ['require', 'exports', 'module', 'jQuery', 'jquery', 'React']
                    }
                    //, sourceMap: true
                }
                , files: [
                    {
                        expand: true
                        , cwd: './src'
                        , src: [ './src/delayload.js' ]
                        , dest: './dist/'
                        , ext: '.min.js'
                    }
                ]
            }
        }
        , babel: {
            options: {
                comments: false
                , modules: 'amd'
                , moduleIds: true
                , getModuleId: function(moduleName) {
                    if (moduleName.match(/\/delayload$/)) {
                        return 'react-delayload'
                    }
                    else if (moduleName.match(/\/test/i)) {
                        return 'main'
                    }
                    return false
                }
                //, sourceMaps: true
                //, code: false
            }
            , dist: {
                files: {
                    "./lib/delayload.js": "./src/delayload.jsx"
                }
            }
        }
        , watch: {
            react: {
                files: ['./src/**/*.jsx']
                , tasks: ['babel']
            }
            , jsx: {
                files: ['./src/**/*.jsx']
                , tasks: ["webpack:dev"]
                , options: {
                    spawn: false,
                }
            }
        }
        , clean: {
            all: ["./dist/*.js"]
        }
        , webpack: {
            example: webpack_dev
        }
    })

    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-babel')
    grunt.loadNpmTasks('grunt-webpack')


    grunt.registerTask('default', ['babel'])
    grunt.registerTask('dev', ['babel', 'watch:react'])

    grunt.registerTask('build', [
        'babel'
        , 'uglify:common'
    ])

    grunt.registerTask('clean', ['clean:all'])

    grunt.registerTask('wp', ['webpack:example'])

}