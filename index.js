const fs = require("fs").promises;
const fsSynchronus = require("fs"); // sync functions won't work with promisify
const HTMLParser = require("node-html-parser");
const config = require("./config.json");
const path = require("path");

const getAllFiles = function (dir, fileArr) {
  let files = fsSynchronus.readdirSync(dir);
  fileArr = fileArr || [];
  files.forEach(function (file) {
    if (fsSynchronus.statSync(dir + "/" + file).isDirectory()) {
      fileArr = getAllFiles(dir + "/" + file, fileArr);
    } else {
      fileArr.push(path.join(__dirname, dir, "/", file));
    }
  });
  return fileArr;
};

async function main() {
  let css = await fs.readFile(config.cssFilePath, "utf8");
  let selectors = new Set(
    css.match(/(?:[\.]{1})([a-zA-Z_]+[\w-_]*)(?:[\s\.\,\{\>#\:]{0})/gim)
  );

  // check if set config is directory, or file
  let isDirectory = fsSynchronus.statSync(config.htmlFilePath).isDirectory();
  if (!isDirectory) {
    let html = await fs.readFile(config.htmlFilePath, "utf8");
    await removeUsedClasses(selectors, html);
  } else if (isDirectory) {
    const files = getAllFiles(config.htmlFilePath);
    for (const file of files) {
      let html = await fs.readFile(file, "utf8");
      await removeUsedClasses(selectors, html);
    }
  } else {
    console.log("Error reading from file");
  }

  console.log("Unused selectors are:", [...selectors].join(" "));
}

/**
 * Removes used selectors from set (mutating it)
 */
async function removeUsedClasses(css, html) {
  const root = HTMLParser.parse(html);
  css.forEach((item) => {
    let selected = root.querySelectorAll(item);
    if (selected.length > 0) {
      css.delete(item);
    }
  });
}

main();
