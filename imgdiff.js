/*jslint white: true, nomen: true, maxlen: 120, plusplus: true, node:true, */
/*global _:false, */

'use strict';

var fs   = require('fs'),
    path = require('path'),
    gm   = require('gm'),
    _    = require('underscore'),
    args = process.argv.slice(2);

require('colors');
require('string-format-js');

var help = function() {
  return [
    'Usage:\n\n'.green.underline,
    '$'.grey,
    'node imgdiff.js',
    '<CORRECT_IMG_DIR_PATH>'.underline,
    '<COMPARE_IMG_DIR_PATH>'.underline,
    '\n'
  ].join(' ');
  // return 'Usage: \n\n  node imgdiff.js <CORRECT_IMG_DIRECTORY_PATH> <COMPARE_IMG_DIRECTORY_PATH>\n';
};

var error = function(message) {
  return [
    '[ERROR]'.red,
    message
  ].join(' ');
};

// 1. check param
if (args.length !== 2) {
  console.log(help());
  process.exit(1);
}

// 2. check directory exists
args.forEach(function(dirname, index) {
  var dirPath = path.join(__dirname, dirname);
  fs.exists(dirPath, function(exists) {
    if (!exists) {
      console.log(error('%s is not found.').format(dirPath));
      process.exit(1);
    }
  });
});





// gm.compare('1.png', 'compare.png', {
//   file: 'diff.png',
//   highlightColor: 'red',
//   tolerance: 0.02
// }, function(err, isEqual, equality, raw, path1, path2) {
//   console.log(arguments);
//   console.log('The images were equal: %s', isEqual);
// });



