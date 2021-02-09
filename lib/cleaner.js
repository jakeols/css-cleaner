const fs = require("fs").promises;
const fsSynchronus = require("fs"); // sync functions won't work with promisify
const HTMLParser = require("node-html-parser");
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

async function clean(cssPath, htmlPath) {
  let isCssDirectory = fsSynchronus.statSync(cssPath).isDirectory();
  let selectors;
  if (!isCssDirectory) {
    console.log(`Reading CSS from file: ${cssPath}`);
    let css = await fs.readFile(cssPath, "utf8");
    selectors = new Set(
      css.match(/(?:[\.]{1})([a-zA-Z_]+[\w-_]*)(?:[\s\.\,\{\>#\:]{0})/gim)
    );
  } else if (isCssDirectory) {
    let tempArr = [];
    const files = getAllFiles(htmlPath);

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
  let isDirectory = fsSynchronus.statSync(htmlPath).isDirectory();
  if (!isDirectory) {
    console.log(`Reading HTML file: ${htmlPath}`);
    let html = await fs.readFile(htmlPath, "utf8");
    await removeUsedClasses(selectors, html);
  } else if (isDirectory) {
    const files = getAllFiles(htmlPath);
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
  try {
    const root = HTMLParser.parse(html);
    css.forEach((item) => {
      let selected = root.querySelectorAll(item);
      if (selected.length > 0) {
        console.log(`Found used selector: ${item}`);
        css.delete(item);
      }
    });  
  } catch (err) {
    console.log(`Error parsing html: ${err}`)
  }
}

module.exports = {
  clean
}