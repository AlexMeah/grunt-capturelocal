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
    test.expect(6);

    var Z4Gbs_Actual = grunt.file.read('test/tmp/Z4Gbs.png');
    var Z4Gbs_Expected = grunt.file.read('test/expected/Z4Gbs.png');
    test.equal(Z4Gbs_Actual, Z4Gbs_Expected, 'Should match');

    var Z4Gbs_thumb_Actual = grunt.file.read('test/tmp/Z4Gbs-thumb.png');
    var Z4Gbs_thumb_Expected = grunt.file.read('test/expected/Z4Gbs-thumb.png');
    test.equal(Z4Gbs_thumb_Actual, Z4Gbs_thumb_Expected, 'Should match');

    var z19qY_Actual = grunt.file.read('test/tmp/z19qY.png');
    var z19qY_Expected = grunt.file.read('test/expected/z19qY.png');
    test.equal(z19qY_Actual, z19qY_Expected, 'Should match');

    var z19qY_thumb_Actual = grunt.file.read('test/tmp/z19qY-thumb.png');
    var z19qY_thumb_Expected = grunt.file.read('test/expected/z19qY-thumb.png');
    test.equal(z19qY_thumb_Actual, z19qY_thumb_Expected, 'Should match');

    var ZQkLA_Actual = grunt.file.read('test/tmp/ZQkLA.png');
    var ZQkLA_Expected = grunt.file.read('test/expected/ZQkLA.png');
    test.equal(ZQkLA_Actual, ZQkLA_Expected, 'Should match');

    var ZQkLA_thumb_Actual = grunt.file.read('test/tmp/ZQkLA-thumb.png');
    var ZQkLA_thumb_Expected = grunt.file.read('test/expected/ZQkLA-thumb.png');
    test.equal(ZQkLA_thumb_Actual, ZQkLA_thumb_Expected, 'Should match');

    test.done();
  },
  irep: function(test) {
    test.expect(2);

    var Z4Gbs_Actual = grunt.file.read('test/tmp/Z4Gbs-full.png');
    var Z4Gbs_Expected = grunt.file.read('test/expected/Z4Gbs-full.png');
    test.equal(Z4Gbs_Actual, Z4Gbs_Expected, 'Should match');

    var Z4Gbs_thumb_Actual = grunt.file.read('test/tmp/Z4Gbs-thumb.png');
    var Z4Gbs_thumb_Expected = grunt.file.read('test/expected/Z4Gbs-thumb.png');
    test.equal(Z4Gbs_thumb_Actual, Z4Gbs_thumb_Expected, 'Should match');

    test.done();
  },
  leap: function(test) {
    test.expect(1);

    var Z4Gbs_Actual = grunt.file.read('test/leap/Z4Gbs.png');
    var Z4Gbs_Expected = grunt.file.read('test/expected/leap/Z4Gbs.png');
    test.equal(Z4Gbs_Actual, Z4Gbs_Expected, 'Should match');

    test.done();
  },
};
