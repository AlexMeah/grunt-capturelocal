# grunt-capturelocal

[![Build Status](http://ci.alexmeah.com/github.com/AlexMeah/grunt-capturelocal/status.svg?branch=master)](http://ci.alexmeah.com/github.com/AlexMeah/grunt-capturelocal)

> Batch screenshot local files using phantomjs and resize

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-capturelocal --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-capturelocal');
```

## The "capturelocal" task

### Overview
In your project's Gruntfile, add a section named `capturelocal` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  capturelocal: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

```js
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
```

### Usage Examples

**You must use expanded mapping as shown below**

#### Default Options
We use the default options which will capture an image 1024x768 named the same as the file, and a thumbnail at 200xauto named filename-thumb.

```js
grunt.initConfig({
  capturelocal: {
    options: {},
    files: [{
      expand: true,
      cwd: './test/fixtures',
      src: ['**/*.html'],
      dest: './test/tmp'
    }],
  },
});
```

#### Custom Options
We use the default options which will capture an image 1024x768 named filename-full, and a thumbnail at 200xauto named filename-thumb.

```js
grunt.initConfig({
  capturelocal: {
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
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
