import path from 'path';
import { accessSync, constants, promises as fsp } from 'fs';
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
    // throw new Error('invalid url');
    return Promise.reject(new Error('invalid url'))
      .catch((er) => {
        console.log('in valid URL');
        throw er;
      });
    // process.exit();
  }
  // try {
  //   accessSync(outputPath, constants.R_OK | constants.W_OK);
  // } catch {
  //   console.error('cannot access');
  //   console.log(outputPath);
  //   throw new Error('directory is bad');
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
  let canonicalPresent = false;

  return axios.get(url)
    .then(({ data }) => {
      initHtml = data;
      return cheerio.load(data);
    })
    .then(($) => {
      const canonicalElement = $('head').find('link[rel="canonical"]');
      // console.log(canonicalElement.length);
      // const $xml = cheerio.load(initHtml, { xml: true });
      // const canonicalElementXml = $xml('head').find('link[rel="canonical"]');
      // const canonicalElement = $('head').find('link[rel="canonical"]');
      // console.log(canonicalElementXml.length);
      // console.log(canonicalElement.length);

      if (canonicalElement.length > 0) {
        canonicalPresent = true;
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
    .then(() => {
      // console.log(canonicalPresent);
      if (canonicalPresent) {
        return fsp.writeFile(`${outputPath}/${resourceFilesDirectoryName}/${htmlFileName}`, `${initHtml}`);
      }

      return null;
    })
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
    })
    .catch((er) => {
      console.log('function catch');
      throw er;
    });
};

export default pageLoader;
