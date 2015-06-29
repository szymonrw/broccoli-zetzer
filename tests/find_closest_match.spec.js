"use strict";

var expect = require("expect.js");

var find_closest_match = require("../find_closest_match");

describe("find_closest_match", function () {
  it("matches file without extension", function () {
    expect(find_closest_match({
      root: "asdf",
      paths: [
        "some-other-file",
        "qwer/file.md"
      ]
    }, "qwer/file")).to.be("asdf/qwer/file.md");
  });

  it("matches file with extension", function () {
    expect(find_closest_match({
      root: "asdf",
      paths: [
        "some-other-file",
        "qwer/file"
      ]
    }, "qwer/file")).to.be("asdf/qwer/file");
  });

  it("doesn't match file with similar but longer path", function () {
    expect(find_closest_match({
      root: "asdf",
      paths: [
        "qwer/file-sub.md",
        "qwer/file.md"
      ]
    }, "qwer/file")).to.be("asdf/qwer/file.md");
  });

  it("doesn't match a directory", function () {
    expect(find_closest_match({
      root: "asdf",
      paths: [
        "qwer/file/",
        "qwer/file"
      ]
    }, "qwer/file")).to.be("asdf/qwer/file");
  });
});
