const fs = require("fs").promises;
const HTMLParser = require("node-html-parser");
const config = require('./config.json');

async function main() {
  let css = await fs.readFile(config.cssFilePath, "utf8");
  let selectors = new Set(
    css.match(/(?:[\.]{1})([a-zA-Z_]+[\w-_]*)(?:[\s\.\,\{\>#\:]{0})/gim)
  );

  let html = await fs.readFile(config.htmlFilePath, "utf8");

  const unusedSelectors = await removeUsedClasses(selectors, html);
  console.log(unusedSelectors);
}

/**
 * Removes used selectors from set, returning only unused css selectors
 */
async function removeUsedClasses(css, html) {
  const root = HTMLParser.parse(html);

  css.forEach((item) => {
    let selected = root.querySelectorAll(item);
    if (selected.length > 0) {
      css.delete(item);
    }
  });

  return css;
}

main();
