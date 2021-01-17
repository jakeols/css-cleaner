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
  let isCssDirectory = fsSynchronus.statSync(config.cssFilePath).isDirectory();
  let selectors;
  if (!isCssDirectory) {
    console.log(`Reading CSS from file: ${config.cssFilePath}`);
    let css = await fs.readFile(config.cssFilePath, "utf8");
    selectors = new Set(
      css.match(/(?:[\.]{1})([a-zA-Z_]+[\w-_]*)(?:[\s\.\,\{\>#\:]{0})/gim)
    );
  } else if (isCssDirectory) {
    let tempArr = [];
    const files = getAllFiles(config.htmlFilePath);

    for (const file of files) {
      if (path.extname(file) === ".css") {
        console.log(`Reading CSS from file: ${file}`);
        let css = await fs.readFile(file, "utf8");
        let currentFileClasses = css.match(
          /(?:[\.]{1})([a-zA-Z_]+[\w-_]*)(?:[\s\.\,\{\>#\:]{0})/gim
        );
        tempArr = tempArr.concat(currentFileClasses);
      } else {
        continue;
      }
    }

    selectors = new Set(tempArr);
  }

  // check if set config is directory, or file
  let isDirectory = fsSynchronus.statSync(config.htmlFilePath).isDirectory();
  if (!isDirectory) {
    console.log(`Reading HTML file: ${config.htmlFilePath}`);
    let html = await fs.readFile(config.htmlFilePath, "utf8");
    await removeUsedClasses(selectors, html);
  } else if (isDirectory) {
    const files = getAllFiles(config.htmlFilePath);
    for (const file of files) {
      if (path.extname(file) === ".html") {
        console.log(`Reading HTML file: ${file}`);
        let html = await fs.readFile(file, "utf8");
        await removeUsedClasses(selectors, html);
      }
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

main()
  .then(function () {
    console.log("Finished");
    process.exit(0);
  })
  .catch(function (err) {
    console.log("Error: " + err);
    process.exit(1);
  });
