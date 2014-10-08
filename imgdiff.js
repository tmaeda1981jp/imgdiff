/*jslint white: true, nomen: true, maxlen: 120, plusplus: true, node:true, */
/*global _:false, */

'use strict';

var fs   = require('fs'),
    path = require('path'),
    gm   = require('gm'),
    _    = require('underscore'),
    doc  = require('heredoc'),
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
  var abspath = path.resolve(path.join(dirPath));
  fs.exists(abspath, function(exists) {
    if (!exists) {
      console.log(error('%s is not found.').format(abspath));
      process.exit(1);
    }
  });
});

var ngImages = [];
var walk = function(correctDir, compareDir, done) {
  fs.readdir(correctDir, function(err, list) {
    var pending = list.length;
    if (err || !pending) {
      return done(null, ngImages);
    }
    list.forEach(function(file) {
      var correct = path.join(correctDir, file),
          compare = path.join(compareDir, file); // TODO check exist

      fs.stat(correct, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(correct, compare);
          if (!--pending) { done(null, ngImages); }
        }
        else {
          if (_.contains(['.jpg', '.gif', '.png', '.ico'], path.extname(file))) {
            gm.compare(correct, compare, {
              // file: 'diff/diff-%s'.format(compare.split('/').join('-')),
              // highlightColor: 'red',
              tolerance: 0.02
            }, function(err, isEqual, equality, raw) {
              fs.exists(compare, function(exists) {
                if (!exists) {
                  console.log(fail(compare + ' (file not found)'));
                }
                else {
                  console.log(isEqual ? success(compare) : fail(compare));
                  if (!isEqual) {
                    ngImages.push({
                      correct: correct,
                      compare: compare
                    });
                  }
                }
                if (!--pending) { done(null, ngImages); }
              });
            });
          }
        }
      });
    });
  });
};

walk(
  path.resolve(path.join(args[0])),
  path.resolve(path.join(args[1])),
  function(err, ngImages) {
    var tplHeader, tplFooter, body;

    if (ngImages.length === 0) {
      console.log('\nNo difference images!\n'.green);
    }
    else {
      console.log('\n%d difference images.'.format(ngImages.length).red);
      tplHeader = doc(function() {/*
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
          <title>imgdiff result</title>
          <meta name="keywords" content="">
          <meta name="description" content="">
          <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" />
        </head>
        <body>
          <div>
      */});

      body = ngImages.map(function(ng) {
        return [
          '<h4>比較元画像: %s</h4>'.format(ng.correct),
          '<img src="%s" style="max-width:500px;" />'.format(ng.correct),
          '<h4>比較対象画像: %s</h4>'.format(ng.compare),
          '<img src="%s" style="max-width:500px;" />'.format(ng.compare),
          '<hr>'
        ].join('\n');
      }).join('\n');

      tplFooter = doc(function() {/*
          </div>
          <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
          <script src="http://cdn.jsdelivr.net/underscorejs/1.7.0/underscore-min.js"></script>
        </body>
      </html>
      */});

      fs.writeFile(
        './result/result-' + new Date().getTime() + '.html',
        tplHeader + body + tplFooter,
        'utf8',
        function(err) {
          if(err) console.log(err);
        }
      );
    }
  });
