#!/usr/bin/env node

var prify = require('es6-promisify')
var path = require('path')
var browserify = require('browserify')
var createWriteStream = require('fs').createWriteStream
var mkdirp = prify(require('mkdirp'))

if (process.argv.length !== 4) {
  throw Error('Usage: target outFile')
}

var pkg = require(path.resolve('package.json'))
var tgt = process.argv[2]
var entry = path.resolve('packages', tgt, 'app.js')

var moduleName = pkg.buildTargets[tgt].moduleName

mkdirp(path.dirname(path.resolve(process.argv[3])))
  .then(function () {
    var output = createWriteStream(path.resolve(process.argv[3]))

    browserify(entry, {
      transform: 'babelify',
      standalone: moduleName,
      paths: [ path.resolve('packages', tgt, 'node_modules') ]
    }).bundle().pipe(output)
  })
