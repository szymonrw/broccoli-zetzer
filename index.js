"use strict";

var fs = require("fs");

var dirname = require("path").dirname;
var join_paths = require("path").join;

var _ = require("underscore");
var mkdirp = require("mkdirp");
var quick_temp = require("quick-temp");
var map_series = require("promise-map-series");
var walk_sync = require("walk-sync");

var parse_setup = require("grunt-stencil/lib/parse");
var compilers_setup = require("grunt-stencil/lib/compilers");
var process_file_setup = require("grunt-stencil/lib/process_file");

var dot_compiler = require("grunt-stencil/lib/dot_compiler")({});
var markdown_compiler = require("grunt-stencil/lib/markdown_compiler");

var META_DATA_SEPARATOR = /\r?\n\r?\n/;

module.exports = stencil;

function stencil (trees, options) {
  var pages_root = trees.pages;
  var partials_root = trees.partials;
  var templates_root = trees.templates;

  options = options     || {};
  var env = options.env || {};

  var tmp = {};
  quick_temp.makeOrReuse(tmp, "path");

  var parse = parse_setup(META_DATA_SEPARATOR);

  var compile = compilers_setup({
    read_content: _.compose(parse.content, read_file),
    compilers:    [dot_compiler, markdown_compiler]
  });

  return {
    read:    read,
    cleanup: cleanup
  };

  function read (read_tree) {
    return map_series([pages_root, partials_root, templates_root], read_tree).then(run);

    function run (paths) {
      var pages     = { root: paths[0], paths: walk_sync(paths[0]) };
      var partials  = { root: paths[1], paths: walk_sync(paths[1]) };
      var templates = { root: paths[2], paths: walk_sync(paths[2]) };

      var process_file = process_file_setup({
        compile:            compile,
        read_header:        _.compose(parse.header, read_file),
        find_closest_match: find_closest_match,
        options: {
          env:       env,
          pages:     pages,
          partials:  partials,
          templates: templates
        }
      });

      pages.paths.forEach(function (path) {
        var result = process_file(path).toString();
        path = path.replace(/(\.[^.]+)+$/, ".html");
        save_file(join_paths(tmp.path, path), result);
      });

      return tmp.path;

      function find_closest_match (tree, name) {
        // Workaround because stencil passes "." for pages here...
        tree = tree === "." ? pages : tree;

        var path = tree.paths.filter(function (path) {
          return path.indexOf(name) === 0;
        })[0];

        return join_paths(tree.root, path);
      }
    }
  }

  function cleanup () {
    quick_temp.remove(tmp, "path");
  }
}

function read_file (path) {
  return fs.readFileSync(path, "utf8");
}

function save_file (path, contents) {
  mkdirp.sync(dirname(path));
  return fs.writeFileSync(path, contents, "utf8");
}
