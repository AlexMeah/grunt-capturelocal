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
		var ProgressBar = require('progress');
		var cpus = require('os').cpus().length;
		var done = this.async();
		var chalk = require('chalk');
		var statik = require('node-static');
		var http = require('http');

		/* Make sure we have files to work with */
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
			/* We use functions to set paths now this makes it more flexible */
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

		/* Remap dest to option.name */
		_.forEach(this.files, function (file) {
			file.dest = options.name(file, options.format);
		});

		/* Store this for later*/
		var files = this.files;

		grunt.log.writeln('Creating server at http://localhost:1339/ for directory', './');
		grunt.log.writeln(chalk.blue('Starting', files.length, 'screenshots...\n'));
		var fileServer = new statik.Server('./');

		var filesMissing = [];
		var server = require('http').createServer(function (request, response) {
			request.addListener('end', function () {
				fileServer.serve(request, response, function (err, result) {
					if (err) { // There was an error serving the file
						filesMissing.push(chalk.red(request.url + ' was ' + err.message + ' called from file ' + path.basename(request.headers.referer)));

						// Respond to the client
						response.writeHead(err.status, err.headers);
						response.end();
					}
				});
			}).resume();
		}).listen(1337);

		var thumbBar = new ProgressBar('[:bar] :eta', { total: files.length, width: 25 });
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
				thumbBar.tick();
				callback();
			});
		}

		var phantomFiles = JSON.stringify(this.files);
		var phantomOptions = JSON.stringify(options);
		var phantomBar = new ProgressBar('[:bar] :eta', { total: files.length, width: 25 });
		var phantomErrors = [];
		var phantom = spawn(phantomjsPath, [path.join(__dirname, '../lib/capture.js'), phantomOptions, phantomFiles]);

		process.stderr.setMaxListeners(0);
		phantom.stderr.on('data', function (data) {
			/* ignore phantomjs noise */
			if (/ phantomjs\[/.test(data)) {
				return;
			}
		});

		phantom.stdout.on('data', function (data) {
			/* stupid phantomjs outputs this on stdout... */
			if (/Couldn\'t load url/.test(data)) {
				grunt.log.warn('Couldn\'t load url');
			} else if (/PAGE ERROR/.test(data)) {
				phantomErrors.push(chalk.red(data));
			} else if (/done/.test(data)) {
				phantomBar.tick();
			} else {
				grunt.log.writeln(data);
			}
		});

		phantom.on('close', function() {
			grunt.log.ok('\nScreenshots done.');
			if (phantomErrors.length) {
				grunt.log.writeln(chalk.underline('\nErrors were found in the following pages:'));
				grunt.log.write(phantomErrors.join('\n'));
			}
			if (filesMissing.length) {
				grunt.log.writeln(chalk.underline('\nSome files are missing:'));
				grunt.log.write(filesMissing.join('\n'));
			}
			if (options.thumb) {
				grunt.log.writeln(chalk.blue('\n\nStarting', files.length, 'thumbs...\n'));
				async.eachLimit(files, cpus, doThumb, function (err) {
					if (err) {
						grunt.log.warn(err);
					}

					grunt.log.ok('\nThumbs done.');
					server.close();
					done();
				});
			} else {
				done();
			}
		});
	});

};
