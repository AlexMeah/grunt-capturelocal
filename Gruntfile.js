/*global format */
/*
 * grunt-capturelocal
 * https://github.com/alexmeah/grunt-capturelocal
 *
 * Copyright (c) 2014 Alex Meah
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
      '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['./test/tmp', './test/leap'],
    },

    // Configuration to be run (and then tested).
    capturelocal: {
      default_options: {
        options: {
          thumb: true
        },
        files: [{
          expand: true,
          cwd: './test/fixtures',
          src: ['**/*.html'],
          dest: './test/tmp'
        }],
      },
      irep: {
        options: {
          thumb: true,
          name: function(file, format) {
            return file.dest.replace(/\.html/, '-full.' + format);
          },
          thumbName: function(file, format) {
            return file.dest.replace('-full.' + format, '-thumb.' + format);
          }
        },
        files: [{
          expand: true,
          cwd: './test/fixtures',
          src: ['**/*.html'],
          dest: './test/tmp'
        }],
      },
      leap: {
        options: {
          thumb: true,
          thumbSize: 400,
          name: function(file, format) {
            var a = file.dest.replace(/\.html/, '-leap.' + format);
            return a;
          },
          thumbName: function(file, format) {
            var a = file.dest.replace('-leap.' + format, '.' + format);
            return a;
          },
          deleteFull: true
        },
        files: [{
          expand: true,
          cwd: './test/fixtures',
          src: ['**/*.html'],
          dest: './test/leap'
        }],
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'capturelocal', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
