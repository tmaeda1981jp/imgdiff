# imgdiff

## Install

```bash
$ brew install imagemagick graphicsmagick
$ git clone git@github.com:tmaeda1981jp/imgdiff.git
$ cd imgdiff
$ npm install
```

## Usage

```bash
$ node imgdiff.js <CORRECT_IMAGE_DIR> <COMPARE_IMAGE_DIR>
```

When you got the following error,

```bash
child_process.js:1121
    throw errnoException(err, 'spawn');
          ^
Error: spawn EAGAIN
    at exports._errnoException (util.js:742:11)
    at ChildProcess.spawn (child_process.js:1121:11)
    at exports.spawn (child_process.js:972:9)
    at Object.exports.execFile (child_process.js:669:15)
    at exports.exec (child_process.js:637:18)
    at Function.compare (/Users/tmaeda1981jp/work/imgdiff/node_modules/gm/lib/compare.js:67:5)
    at /Users/tmaeda1981jp/work/imgdiff/imgdiff.js:74:16
    at Object.oncomplete (fs.js:97:15)
```

Try this.

```bash
$ sudo ulimit -n 4096
```
