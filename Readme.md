Small utility to find unused CSS classes in your HTML files, allowing you to purge them. Made for static sites where there is a large number of generated `.html` files with a lot of compiled styles. 

# Installation
Clone the repo, and install dependencies
```bash
$ git clone git@github.com:jakeols/css-cleaner.git
$ cd css-cleaner && yarn install
```

# Config
Setup a simple config file to set `.css` file locations and `.html` file locations. `cssFilePath` and `htmlFilePath` can be directories, and can contain any file types. 

```json
{
    "cssFilePath": "./dist/main.css",
    "htmlFilePath": "./dist/"
}
```