"use strict";

var stencil = require("./index");

module.exports = function (broccoli) {
  var pages = broccoli.makeTree("node_modules/grunt-stencil/spec/fixtures");
  var partials = broccoli.makeTree("node_modules/grunt-stencil/spec/includes");
  var templates = broccoli.makeTree("node_modules/grunt-stencil/spec/templates");

  var site = stencil({
    pages: pages,
    partials: partials,
    templates: templates
  });

  return site;
}
