"use strict";

var stencil = require("./index");

var pages = "node_modules/grunt-stencil/spec/fixtures";
var partials = "node_modules/grunt-stencil/spec/includes";
var templates = "node_modules/grunt-stencil/spec/templates";

var site = stencil({
  pages: pages,
  partials: partials,
  templates: templates
});

module.exports = site;
