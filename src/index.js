import path from 'path';
import { promises as fsp } from 'fs';
// import { constants, promises as fsp } from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';
import Listr from 'listr';
import {
  generateResourceFilesDirectoryName,
  generateHtmlFileName,
  isValidUrl,
  // getResourceFileName,
  // downLoadResource,
  createResourceDirectory, editResourcePathesInHtml, downloadResources,
} from './utils.js';

const defaultDirectory = process.cwd();

const pageLoader = (url, outputPath = defaultDirectory) => {
  if (!isValidUrl(url)) {
    throw new Error('invalid url');
    // process.exit();
  }

  // fsp.access(outputPath, constants.W_OK).catch((er) => { throw er });
  // fs.accessSync(outputPath);
  // try {
  //   fs.accessSync(outputPath);
  //   console.log('can read/write');
  // } catch (err) {
  //   throw new Error('cant access');
  // }

  const resourceFilesDirectoryName = generateResourceFilesDirectoryName(url);
  const htmlFileName = generateHtmlFileName(url);
  const myUrl = new URL(url);
  const resourceFilesDirectoryPath = path.join(outputPath, resourceFilesDirectoryName);
  const resourceTypeSelectorMap = {
    images: 'img',
    styles: 'link[rel="stylesheet"]',
    scripts: 'script',
  };
  const originalResourcesUrls = {
    images: [],
    styles: [],
    scripts: [],
  };
  let initHtml;

  return axios.get(url)
    .then(({ data }) => {
      initHtml = data;
      return cheerio.load(data);
    })
    .then(($) => {
      // console.log('hui')
      // console.log($);
      const canonicalElement = $('link[rel="canonical"]');
      if (canonicalElement) {
        const link = canonicalElement.attr('href');
        if (link) {
          canonicalElement.attr('href', `${resourceFilesDirectoryName}/${htmlFileName}`);
        }
      }

      Object.entries(resourceTypeSelectorMap).forEach(([type, selector]) => {
        editResourcePathesInHtml(
          selector, type, resourceFilesDirectoryPath, $, myUrl, originalResourcesUrls,
        );
      });

      return $;
    })
    .then(($) => fsp.writeFile(`${outputPath}/${htmlFileName}`, `${$.html()}`))
    .then(() => createResourceDirectory(outputPath, resourceFilesDirectoryPath))
    .then(() => fsp.writeFile(`${outputPath}/${resourceFilesDirectoryName}/${htmlFileName}`, `${initHtml}`))
    .then(() => {
      const tasks = Object.keys(resourceTypeSelectorMap).map((type) => (
        {
          title: `Downloading ${type}`,
          task: () => (
            downloadResources(originalResourcesUrls[type], resourceFilesDirectoryPath, myUrl)
          ),
        }));
      const listr = new Listr(tasks, { concurrent: true });
      return listr.run();
    });
};

export default pageLoader;
