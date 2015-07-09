# Zetzer for Broccoli

[Zetzer][zetzer] plugin for [Broccoli][broccoli].

For documentation and configuration options see [Zetzer's
repo][zetzer].

Example Brocfile:

    var zetzer = require("broccoli-zetzer")

    var htmls = zetzer({
      pages:     "pages",
      partials:  "partials",
      templates: "templates",
      ... // other options
    })

    module.exports = htmls

## Copying

MIT, see [COPYING](COPYING).

[zetzer]: https://github.com/brainshave/zetzer
[broccoli]: https://github.com/broccolijs/broccoli
