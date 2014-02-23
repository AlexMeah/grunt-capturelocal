/*globals phantom,document,window*/
'use strict';
var webpage = require('webpage');
var page = webpage.create();
var system = require('system');
var args = system.args;
var options = JSON.parse(args[1]);
var files = JSON.parse(args[2]);
var viewport = options.viewport.split('x');
var currentPage = '';

var log = console.log;
// make sure phantom never outputs to stdout
console.log = console.error;

function basefile(path) {
	return path.split(/\\|\//).pop();
}

phantom.onError = function(msg, trace) {
	var msgStack = ['PHANTOM ERROR: ' + msg];

	if (trace && trace.length) {
		msgStack.push('TRACE:');
		trace.forEach(function(t) {
			msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
		});
	}

	console.error(msgStack.join('\n'));
};

page.onError = function(msg, trace) {
	var msgStack = ['ERROR: ' + msg];
	if (trace && trace.length) {
		msgStack.push('PAGE ERROR:');
		trace.forEach(function(t) {
			msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
		});
	}
	console.error(msgStack.join('\n'));
};

page.clipRect = { top: 0, left: 0, width: viewport[0], height: viewport[1] };

function capture (file) {
	currentPage = file.src[0];
	page.open('http://localhost:1337/' + file.src[0], function (status) {
		if (status === 'fail') {
			console.error('Couldn\'t load url');
			phantom.exit(1);
		}

		page.evaluate(function() {
			var style = document.createElement('style');
			var text = document.createTextNode('body { background: #fff; } .screenshot { transition-duration: 0s !important; -webkit-transition-duration: 0s !important;  }');
			style.setAttribute('type', 'text/css');
			style.appendChild(text);
			document.head.insertBefore(style, document.head.firstChild);

			// Fire animation with no transition
			[].forEach.call(document.querySelectorAll('.screenshot'), function (el) {
				el.classList.add('active');
			});
		});

		page.viewportSize = {
			width: viewport[0],
			height: viewport[1]
		};

		window.setTimeout(function () {
			page.render(file.dest);
			console.log('done');

			if (files.length) {
				capture(files.shift());
			} else {
				phantom.exit(1);
			}
		}, options.delay);
	});
}

capture(files.shift());