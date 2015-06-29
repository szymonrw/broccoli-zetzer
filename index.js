"use strict";

var fs = require("fs");

var dirname = require("path").dirname;
var join_paths = require("path").join;

var _ = require("underscore");
var mkdirp = require("mkdirp");
var map_series = require("promise-map-series");
var walk_sync = require("walk-sync");

var filter = require("broccoli-dep-filter");

var parse_setup = require("zetzer/parse");
var compilers_setup = require("zetzer/compilers");
var process_file_setup = require("zetzer/process");

var dot_compiler = require("zetzer/dot")({});
var markdown_compiler = require("zetzer/markdown");

var META_DATA_SEPARATOR = /\r?\n\r?\n/;

module.exports = zetzer;

function zetzer (trees, options) {
  var pages_tree = trees.pages;
  var partials_tree = trees.partials;
  var templates_tree = trees.templates;

  options = options     || {};
  var env = options.env || {};

  var parse = parse_setup(META_DATA_SEPARATOR);

  var compile = compilers_setup({
    read_content: _.compose(parse.content, read_file),
    compilers:    [dot_compiler, markdown_compiler]
  });

  return filter({
    trees: {
      pages: pages_tree,
      partials: partials_tree,
      templates: templates_tree
    },
    iterated: ["pages"],
    init: init,
    extensions: ["html", "md"],
    target: "html",
    read: false,
    name: "Zetzer"
  });

  function init (roots) {
    var partials  = { root: roots.partials, paths: walk_sync(roots.partials) };
    var templates = { root: roots.templates, paths: walk_sync(roots.templates) };

    var process_file = process_file_setup({
      compile:            compile,
      read_header:        _.compose(parse.header, read_file),
      find_closest_match: find_closest_match,
      options: {
        env:       env,
        partials:  partials,
        templates: templates
      }
    });

    return run;

    function run (path) {
      return process_file(path).toString();
    }

    function find_closest_match (tree, name) {
      // Zetzer for pages passes "." which should be changed
      if (tree === ".") {
        return name;
      }

      var path = tree.paths.filter(function (path) {
        return !is_directory(path) && file_matches(name, path);
      })[0];

      if (path === undefined) {
        throw new Error('Couldn\'t find a matching file for ' + name);
      }

      return join_paths(tree.root, path);
    }
  }
}

function read_file (path) {
  return fs.readFileSync(path, "utf8");
}

function is_directory (path) {
  // path ends with slash
  return /\/$/.test(path);
}

function file_matches (name, path) {
  // has at least one-char extension
  return name === path || new RegExp("^" + name + "\\..").test(path);
}
