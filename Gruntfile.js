"use strict";

var webpack_dev = require('./webpack.config')

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
                , modules: 'common'
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
            dev: webpack_dev
        }
    })

    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-babel')
    grunt.loadNpmTasks('grunt-webpack')


    grunt.registerTask('default', ['babel' , 'watch:react'])
    grunt.registerTask('dev', ['babel'])

    grunt.registerTask('build', [
        'babel'
        , 'uglify:common'
    ])

    grunt.registerTask('clean', ['clean:all'])

    grunt.registerTask('wp', ['webpack:dev'])
    grunt.registerTask('wp-dev', ['webpack:dev', 'watch:jsx'])

}