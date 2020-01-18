'use strict';

const path = require('path');
const fs = require('fs');
const uglifyjs = require('uglifyjs');
const debug = require('debug')('tree');
const Config = require('./lib/Config');

var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;


if (process.argv.length <= 3) {
  console.log("Usage: " + __filename + " [JS | HTML] <srcFile> <destFile>");
  process.exit(-1);
}

console.log("Running " + __filename + " " + process.argv[0] + " " +process.argv[1] + " " + process.argv[2]+ "... ");

//main({ srcfilename: process.argv[] })


/**
 * Recursively find all dependencies (avoiding circular) traversing the entire dependency tree
 * and returns a flat list of all unique, visited nodes
 *
 * @param {Object} options
 * @param {String} options.srcfilename - The path of the module whose tree to traverse
 * @param {String} options.destfilename
 * @param {String} options.fileType - The directory containing all JS files
//  * @param {String} [options.requireConfig] - The path to a requirejs config
//  * @param {String} [options.webpackConfig] - The path to a webpack config
//  * @param {String} [options.nodeModulesConfig] - config for resolving entry file for node_modules
//  * @param {Object} [options.visited] - Cache of visited, absolutely pathed files that should not be reprocessed.
//  *                             Format is a filename -> tree as list lookup table
//  * @param {Array} [options.nonExistent] - List of partials that do not exist
//  * @param {Boolean} [options.isListForm=false]
//  * @param {String|Object} [options.tsConfig] Path to a typescript config (or a preloaded one).
 * @return {Object}
 */

function main(options) {
  const config = new Config(options);

  if (!fs.existsSync(config.srcfilename)) {
    debug('file ' + config.srcfilename + ' does not exist');
    return {};
  }

  if (!fs.existsSync(config.destfilename)) {
    debug('file ' + config.destfilename + ' does not exist');
    return {};
  }

  if (!config.fileType) {
    debug('FileType ' + config.fileType + ' was not specified');
    return {};
  }  

  fs.open(config.srcfilename, 'r', (err, contents) => {
    if (err) throw err;
    console.log('File opens just fine');

    var ast = jsp.parse(contents);
    ast = pro.ast_mangle(ast);
    ast = pro.ast_squeeze(ast);
    var final_code = pro.gen_code(ast);

    fs.close(fd, (err) => {
      if (err) throw err;
    });
  });

  // var orig_code = fs.open(config.srcfilename,)
  // var ast = jsp.parse(orig_code); // parse code and get the initial AST
  // ast = pro.ast_mangle(ast); // get a new AST with mangled names
  // ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
  // var final_code = pro.gen_code(ast); // compressed code here  
};


