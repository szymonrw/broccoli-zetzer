"use strict";

var fs = require("fs");

var _ = require("lodash");
var map_series = require("promise-map-series");
var walk_sync = require("walk-sync");

var filter = require("broccoli-dep-filter");

var parse_setup = require("zetzer/parse");
var compilers_setup = require("zetzer/compilers");
var process_file_setup = require("zetzer/process");

var dot_compiler_setup = require("zetzer/dot");
var markdown_compiler = require("zetzer/markdown");

var find_closest_match = require("./find_closest_match");

var META_DATA_SEPARATOR = /\r?\n\r?\n/;

module.exports = zetzer;

function zetzer (options, options_compat) {
  // options_compat is only for backwards compatibility because
  // previously options were passed separately from trees
  options = _.merge({}, options, options_compat);

  var pages_tree = options.pages;
  var partials_tree = options.partials;
  var templates_tree = options.templates;

  var env = options.env || {};

  var parse = parse_setup(options.meta_data_separator || META_DATA_SEPARATOR);
  var dot_compiler = dot_compiler_setup({
    template_settings: options.dot_template_settings || {}
  });

  var compile = compilers_setup({
    read_content: (path) => parse.content(read_file(path)),
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
      read_header:        (path) => parse.header(read_file(path)),
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
  }
}

function read_file (path) {
  return fs.readFileSync(path, "utf8");
}
