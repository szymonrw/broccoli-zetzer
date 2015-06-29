'use strict';

var zetzer = require('../');
var expect = require('expect.js');
var broccoli = require('broccoli');
var fs = require('fs');
var builder;

describe('broccoli zetzer', function() {
  afterEach(function() {
    if (builder) {
      builder.cleanup();
    }
  });

  it ('should generate HTML page with partial', function() {
    var tree = zetzer({
      pages: 'tests/fixtures/pages',
      partials: 'tests/fixtures/partials',
      templates: 'tests/fixtures/templates'
    });

    builder = new broccoli.Builder(tree);

    return builder.build().then(function(dir) {
      var actual = fs.readFileSync(dir.directory + '/home.dot.html', {encoding: 'utf8'});
      var expected = fs.readFileSync('tests/mocks/home.html', {encoding: 'utf8'});
      expect(actual).to.equal(expected);
    });
  });

  it ('should generate HTML page with partial in sub-folder', function() {
    var tree = zetzer({
      pages: 'tests/fixtures/pages-subcomponent',
      partials: 'tests/fixtures/partials',
      templates: 'tests/fixtures/templates'
    });

    builder = new broccoli.Builder(tree);

    return builder.build().then(function(dir) {
      var actual = fs.readFileSync(dir.directory + '/home.dot.html', {encoding: 'utf8'});
      var expected = fs.readFileSync('tests/mocks/home-subcomponent.html', {encoding: 'utf8'});
      expect(actual).to.equal(expected);
    });
  });
});
