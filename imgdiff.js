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
};

var error = function(message) {
  return [ '[ERROR]'.red, message ].join(' ');
};

var success = function(file) {
  return [ '✓'.green, file ].join(' ');
};

var fail = function(file) {
  return [ '✗'.red, file ].join(' ');
};

// 1. check param
if (args.length !== 2) {
  console.log(help());
  process.exit(1);
}

// 2. check directory exists
args.forEach(function(dirPath) {
  fs.exists(dirPath, function(exists) {
    if (!exists) {
      console.log(error('%s is not found.').format(dirPath));
      process.exit(1);
    }
  });
});

var walk = function(correctDir, compareDir) {
  fs.readdir(correctDir, function(err, list) {
    list.forEach(function(file) {
      var correct = path.join(correctDir, file),
          compare = path.join(compareDir, file); // TODO check exist

      fs.stat(correct, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(correct, compare);
        }
        else {
          if (_.contains(['.jpg', '.gif', '.png', '.ico'], path.extname(file))) {
            gm.compare(correct, compare, {
              file: 'diff/diff-%s'.format(compare.split('/').join('-')),
              highlightColor: 'red',
              tolerance: 0.02
            }, function(err, isEqual, equality, raw) {
              fs.exists(compare, function(exists) {
                if (!exists) {
                  console.log(fail(compare + ' (file not found)'));
                }
                else {
                  console.log(isEqual ? success(compare) : fail(compare));
                }
              });
            });
          }
        }
      });
    });
  });
};
walk(args[0], args[1]);
