Small utility to find unused CSS classes in your HTML files, allowing you to purge them. Made for static sites where there is a large number of generated `.html` files with a lot of compiled styles. 

# Installation
Clone the repo, and install dependencies
```bash
$ git clone git@github.com:jakeols/css-cleaner.git
$ cd css-cleaner && yarn install
```

# Config
Setup a simple config file called `config.json` to set `.css` file locations and `.html` file locations. `cssFilePath` and `htmlFilePath` can be directories, and can contain any file types. See example below or `config.json.example` file.

```json
{
    "cssFilePath": "./dist/main.css",
    "htmlFilePath": "./dist/"
}
```
# Todo
- Support parsing other file types (such as `.js` / `.jsx` , `.php`, `.hbs`, etc.) for `class` or `className` (configurable)
