/*
 * grunt-htmlojc
 * https://github.com/huadong1989/grunt-htmlojc
 *
 * Copyright (c) 2015 hadon
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    // Configuration to be run (and then tested).
    htmlojc: {
       main:{
         options: {
            domain:'',
            rootPath:'example',
            dest:'statics/release'
         },
         files: [
            {
              src:'example/**/*.html'
            }
          ]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['htmlojc:main']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);

};
