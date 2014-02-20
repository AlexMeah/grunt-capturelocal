/*
* grunt-capturelocal
* https://github.com/alexmeah/grunt-capturelocal
*
* Copyright (c) 2014 Alex Meah
* Licensed under the MIT license.
*/

'use strict';

module.exports = function(grunt) {

	/* Please see the Grunt documentation for more information regarding task */
	/* creation: http://gruntjs.com/creating-tasks */

	grunt.registerMultiTask('capturelocal', 'Batch screenshot local files using phantomjs and resize using imagemagick', function() {
		var _ = require('lodash');
		var im = require('imagemagick');
		var path = require('path');
		var phantomjsPath = require('phantomjs').path;
		var spawn = require('child_process').spawn;
		var async = require('async');
		var cpus = require('os').cpus().length;
		var done = this.async();

		if (!/\.html/.test(this.files[0].dest)) {
			grunt.log.warn('No files matched');
			done();
		}

		/* Default options these get merged with user options */
		var options = this.options({
			viewport: '1024x768',
			deleteFull: false,
			thumb: true,
			thumbSize: '200',
			name: function(file, format) {
				var a = file.dest.replace(/\.html/, '.' + format);
				return a;
			},
			thumbName: function(file, format) {
				var a = file.dest.replace('.' + format, '-thumb.' + format);
				return a;
			},
			format: 'png',
			delay: 0
		});

		_.forEach(this.files, function (file) {
			file.dest = options.name(file, options.format);
		});

		var files = this.files;

		function doThumb(file, callback) {
			im.resize({
				srcPath: file.dest,
				dstPath: options.thumbName(file, options.format),
				width: options.thumbSize
			}, function (err, stdout, stderr) {
				if (err || stdout || stderr) {
					console.log('Error on page ' + file.dest + ': ' + err, stdout, stderr);
				}
				if (options.deleteFull) {
					grunt.file.delete(file.dest);
				}
				grunt.log.writeln('Thumb created for,', file.dest);
				callback();
			});
		}

		var phantomFiles = JSON.stringify(this.files);
		var phantomOptions = JSON.stringify(options);

		var phantom = spawn(phantomjsPath, [path.join(__dirname, '../lib/capture.js'), phantomOptions, phantomFiles]);

		process.stderr.setMaxListeners(0);
		phantom.stderr.on('data', function (data) {
			/* ignore phantomjs noise */
			if (/ phantomjs\[/.test(data)) {
				return;
			} else {
				grunt.log.writeln('screenshots completed');
			}
		});

		phantom.stdout.on('data', function (data) {
			/* stupid phantomjs outputs this on stdout... */
			if (/Couldn\'t load url/.test(data)) {
				grunt.fail.warn('Couldn\'t load url');
			} else {
				grunt.log.writeln(data);
			}
		});

		phantom.on('close', function() {
			grunt.log.ok('screenshots done.');
			if (options.thumb) {
				grunt.log.ok('Doing', files.length, 'thumbs.');
				async.eachLimit(files, cpus, doThumb, function (err) {
					if (err) {
						grunt.log.warn(err);
					}

					grunt.log.writeln('Thumbs done.');
					done();
				});
			} else {
				done();
			}
		});
	});

};
