"use strict";

var join_paths = require("path").join;

module.exports = find;

function find (tree, name) {
  // Zetzer for pages passes "." which should be changed
  if (tree === ".") {
    return name;
  }

  var path = tree.paths.filter(function (path) {
    return file_matches(name, path);
  })[0];

  if (path === undefined) {
    throw new Error('Couldn\'t find a matching file for ' + name);
  }

  return join_paths(tree.root, path);
}

function file_matches (name, path) {
  // is the same or has at least one-char extension
  return name === path || new RegExp("^" + name + "\\..").test(path);
}
