# `@jakeols/css-cleaner`

Small utility to find unused CSS classes in your HTML files, allowing you to purge them. Made for static sites where there is a large number of generated `.html` files with a lot of compiled styles. <b>Requires Node > 12.x</b>

## Installation
Install via `npm` or `yarn` globally
```bash
$ npm install @jakeols/css-cleaner -g
```
## Usage 
`css-cleaner --help` will show the following CLI args
```bash
Options:
  -s, --styles     The path to your styles.                           [required]
  -t, --templates  The path to your templates                         [required]
  -h, --help       Show help                                           [boolean]
  -v, --version    Show version number                                 [boolean]

Examples:
  css-cleaner -s=style.css -t=index.html  Print unused styles from given
                                          templates
```

__Note__: `--templates` and `--styles` can be files, or directories. 

## Todo
- Support parsing other file types (such as `.js` / `.jsx` , `.php`, `.hbs`, etc.) for `class` or `className` (configurable)
