"use strict";

var zetzer = require("./index");

var pages = "node_modules/grunt-zetzer/spec/fixtures";
var partials = "node_modules/grunt-zetzer/spec/includes";
var templates = "node_modules/grunt-zetzer/spec/templates";

var site = zetzer({
  pages: pages,
  partials: partials,
  templates: templates
});

module.exports = site;
