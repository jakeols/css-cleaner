import path from 'path';
import * as fsSynchronus from 'fs';
import * as fs from 'fs/promises';
import { parse } from 'node-html-parser';

/**
 * Returns all files from directory
 * @param dir
 * @param fileArr
 */
const getAllFiles = (dir: string, fileArr?: string[]) => {
  let files: string[] = fsSynchronus.readdirSync(dir);
  fileArr = fileArr || [];
  files.forEach(function(file: string) {
    if (fsSynchronus.statSync(dir + '/' + file).isDirectory()) {
      fileArr = getAllFiles(dir + '/' + file, fileArr);
    } else {
      fileArr?.push(path.join(dir, '/', file));
    }
  });
  return fileArr;
};

/**
 * Removed unusued classes from set
 * @param css
 * @param html
 */
const removeUsedClasses = async (css: Set<string>, html: string) => {
  try {
    const root = parse(html);
    css.forEach(item => {
      let selected = root.querySelectorAll(item);
      if (selected.length > 0) {
        console.log(`Found used selector: ${item}`);
        css.delete(item);
      }
    });
  } catch (err) {
    console.log(`Error parsing html: ${err}`);
  }
};

/**
 * Returns unused css classes
 * @param cssPath
 * @param htmlPath
 */
export const clean = async (cssPath: string, htmlPath: string) => {
  let cssPathRel = path.join(process.cwd(), '/', cssPath);
  let htmlPathRel = path.join(process.cwd(), '/', htmlPath);
  let isCssDirectory = fsSynchronus.statSync(cssPathRel).isDirectory();
  let selectors: Set<string> = new Set();
  let currentFileClasses: RegExpMatchArray | null = null;

  if (!isCssDirectory) {
    console.log(`Reading CSS from file: ${cssPathRel}`);
    let css = await fs.readFile(cssPathRel, 'utf8');
    selectors = new Set(
      css.match(/(?:[\.]{1})([a-zA-Z_]+[\w-_]*)(?:[\s\.\,\{\>#\:]{0})/gim)
    );
  } else if (isCssDirectory) {
    const files = getAllFiles(cssPathRel);

    for (const file of files) {
      if (path.extname(file) === '.css') {
        console.log(`Reading CSS from file: ${file}`);
        let css = await fs.readFile(file, 'utf8');
        currentFileClasses = css.match(
          /(?:[\.]{1})([a-zA-Z_]+[\w-_]*)(?:[\s\.\,\{\>#\:]{0})/gim
        );
      }
    }

    selectors = new Set(currentFileClasses);
  }

  // check if set config is directory, or file
  let isDirectory = fsSynchronus.statSync(htmlPathRel).isDirectory();
  if (!isDirectory) {
    console.log(`Reading HTML file: ${htmlPathRel}`);
    let html = await fs.readFile(htmlPathRel, 'utf8');
    await removeUsedClasses(selectors, html);
  } else if (isDirectory) {
    const files = getAllFiles(htmlPathRel);
    for (const file of files) {
      if (path.extname(file) === '.html') {
        console.log(`Reading HTML file: ${file}`);
        let html = await fs.readFile(file, 'utf8');
        await removeUsedClasses(selectors, html);
      }
    }
  } else {
    console.log('Error reading from file');
  }

  console.log('Unused selectors are:', Array.from(selectors).join(' '));
};
