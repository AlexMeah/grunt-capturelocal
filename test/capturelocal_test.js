'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.capturelocal = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(3);

    /*
    * Check that files are created
    */

    var zX79B = grunt.file.exists('test/tmp/zX79B.png');
    test.ok(zX79B, 'zX79B should exist');

    var zyjkc = grunt.file.exists('test/tmp/zyjkc.png');
    test.ok(zyjkc, 'zyjkc should exist');

    /*
    * Check that files are different
    */

    var zX79B_val = grunt.file.read('test/tmp/zX79B.png');
    var zyjkc_val = grunt.file.read('test/tmp/zyjkc.png');
    test.notEqual(zX79B_val, zyjkc_val, 'Files should not be the same');

    test.done();
  },
  irep: function(test) {
    test.expect(3);

    /*
    * Check that files are created with the correct renaming
    */

    var zX79B = grunt.file.exists('test/tmp/zX79B-full.png');
    test.ok(zX79B, 'zX79B should exist');

    var zyjkc = grunt.file.exists('test/tmp/zyjkc-thumb.png');
    test.ok(zyjkc, 'zyjkc-thumb should exist');

    /*
    * Check that files are different
    */

    var zX79B_val = grunt.file.read('test/tmp/zX79B-full.png');
    var zyjkc_val = grunt.file.read('test/tmp/zyjkc-full.png');
    test.notEqual(zX79B_val, zyjkc_val, 'Files should not be the same');

    test.done();
  }
};
