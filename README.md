# mu-pdf-viewer [![Build Status](https://travis-ci.org/azu/mu-pdf-viewer.svg?branch=master)](https://travis-ci.org/azu/mu-pdf-viewer)

PDF viewer on electron

## Features

- [PDF.js](https://github.com/mozilla/pdf.js "PDF.js") based
    - [Frequently Asked Questions · mozilla/pdf.js Wiki](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions "Frequently Asked Questions · mozilla/pdf.js Wiki")
- Improve scroll by J, K
- Drag and Drop support
- Ctrl + Shift + C: Copy current page and text

![screenshot](https://monosnap.com/file/BfCnnmtQZhiRNDAfahDjTtzQpy4nss.png)

## Install

Install with [npm](https://www.npmjs.com/):

    npm install mu-pdf-viewer -g

## Usage

### CLI

Open app with pdf file.

    $ mu-pdf-viewer <pdf-file-path>

### App

Download binary from latest release

- https://github.com/azu/mu-pdf-viewer/releases/latest

Or Build by yourself

OS X:

    npm run electron:build:osx

Windows:

    npm run electron:build:win

Linux:

    npm run electron:build:linux


## Architecture

- Apply keyboard patch for public/pdfjs
- Use old pdfjs version for `file://`

## Development

Watch change and launch app.

    npm start

## Changelog

See [Releases page](https://github.com/azu/mu-pdf-viewer/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/mu-pdf-viewer/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
