/* global module */

module.exports = function(grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
            ' * Bootforce v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Bootforce owes much to Bootstrap "http://getbootstrap.com"\n' +
            ' * Licensed under the <%= pkg.license %> license\n' +
            ' */\n',
        'bower-install-simple': {
            options: {
                color: true,
                directory: 'app/lib'
            },
            'prod': {
                options: {
                    production: true
                }
            },
            'dev': {
                options: {
                    production: false
                }
            }
        },
        env: {
            options: {
                /* Shared Options Hash */
                //globalOption : 'foo'
            },
            dev: {
                NODE_ENV: 'DEVELOPMENT'
            },
            prod: {
                NODE_ENV: 'PRODUCTION'
            }
        },
        preprocess: {
            dev: {
                files: {
                    'app/index.html': 'app/tmpl/index.html'
                }
            },
            prod: {
                files: {
                    'build/index.html': 'app/tmpl/index.html'
                }
            }
        },
        watch: {
            files: ['app/sass/**/*.scss', 'app/scripts/**/*.js', 'app/tmpl/**/*.html'],
            tasks: ['preprocess', 'sassCompile'],
            options: {
                spawn: false,
                livereload: true
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'app/scripts/**/*.js'],
            options: {
                jshintrc: true
            }
        },
        sass: {
            options: {
                sourceMap: true,
                outputStyle: 'expanded',
                sourceComments: false,
                includePaths: [
                    'app/lib/salesforce-lightning-design-system/scss',
                    'app/lib/font-awesome'
                ]
            },
            dist: {
                files: {
                    'app/styles/main.css': 'app/sass/main.scss'
                }
            }
        },
        connect: {
            build: {
                options: {
                    port: 8000,
                    base: 'app',
                    keepalive: false,
                    livereload: true
                }
            },
            deploy: {
                options: {
                    port: 8001,
                    base: 'build',
                    keepalive: true
                }
            }
        },
        uglify: {
            options:{
                maxLineLen: 500,
                preserveComments: false,
                sourceMap: true,
                banner: '<%= banner %>'
            },
            main: {
                files: {
                    'build/scripts/main.min.js': 'build/scripts/main.js'
                }

            },
            bootforce: {
                files: {
                    'build/dist/<%= pkg.name %>.min.js': 'build/dist/<%= pkg.name %>.js'
                }
            }
        },
        imagemin: {
            png: {
                options: {
                    optimizationLevel: 7
                },
                files: [{
                    expand: true,
                    cwd: 'app/assets/',
                    src: ['**/*.png'],
                    dest: 'dist/assets/',
                    ext: '.png'
                }]
            },
            jpg: {
                options: {
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: 'app/assets/',
                    src: ['**/*.jpg'],
                    dest: 'dist/assets/',
                    ext: '.jpg'
                }]
            }
        },
        copy: {
            static: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'app',
                    dest: 'build',
                    src: [
                        'styles/{,*/}**',
                        'scripts/{,*/}**',
                        'data/{,*/}**',
                        'assets/{,*/}**',
                        'lib/salesforce-lightning-design-system/assets/styles'
                            + '/salesforce-lightning-design-system.css',
                        'lib/jquery/dist/jquery.min.js',
                        'lib/isotope/dist/isotope.pkgd.js'
                    ]
                }]
            },
            dev: {
                files: [{
                    dest: 'build/dist/scripts/bootforce.min.js',
                    src: 'dist/bootforce.min.js'
                }]
            }
        },
        notify: {
            sass: {
                options: {
                    title: 'SASS task done',
                    message: 'Styles have been recompiled'
                }
            }
        }
    });

    // Bower integration
    grunt.registerTask('bower', ['bower-install-simple']);

    grunt.registerTask('server', ['connect:build']);


    grunt.registerTask('build', [
        'jshint',
        'bower',
        'env:prod',
        'copy:static',
        'copy:dev',
        'preprocess:prod',
        'connect:deploy'
    ]);

    grunt.registerTask('default', [
        'env:dev',
        'preprocess:dev',
        'server',
        'watch'
    ]);
};
