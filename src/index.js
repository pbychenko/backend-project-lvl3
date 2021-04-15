import axios from 'axios';
import cheerio from 'cheerio';
import path from 'path';
import { promises as fsp } from 'fs';
import Listr from 'listr';
import {
  generateResourceFilesDirectoryName,
  generateHtmlFileName,
  isValidUrl, editResourcePathesInHtml, downloadResources, editCanonicalPathInHtml,
} from './utils.js';

const defaultDirectory = process.cwd();

const pageLoader = (url, outputPath = defaultDirectory) => {
  console.log(url);
  console.log(outputPath);

  if (!isValidUrl(url)) {
    return Promise.reject(new Error('Invalid url. Please check'));
  }

  const resourceFilesDirectoryName = generateResourceFilesDirectoryName(url);
  const htmlFileName = generateHtmlFileName(url);
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
  let canonicalPresent;

  return axios.get(url)
    .then(({ data }) => {
      initHtml = data;
      return cheerio.load(data);
    })
    .then(($) => {
      canonicalPresent = $('link[rel="canonical"]').length > 0;
      if (canonicalPresent) {
        editCanonicalPathInHtml($, resourceFilesDirectoryName, htmlFileName);
      }

      Object.entries(resourceTypeSelectorMap).forEach(([type, selector]) => {
        editResourcePathesInHtml(
          selector, type, resourceFilesDirectoryName, $, url, originalResourcesUrls,
        );
      });

      return $.html();
    })
    .then((html) => fsp.writeFile(path.join(outputPath, htmlFileName), html))
    .then(() => fsp.mkdir(resourceFilesDirectoryPath))
    .then(() => (
      canonicalPresent ? fsp.writeFile(
        path.join(resourceFilesDirectoryPath, htmlFileName),
        initHtml,
      ) : null))
    .then(() => {
      const tasks = Object.keys(resourceTypeSelectorMap).map((type) => (
        {
          title: `Downloading ${type}`,
          task: () => (
            downloadResources(originalResourcesUrls[type], resourceFilesDirectoryPath)
          ),
        }));
      const listr = new Listr(tasks, { concurrent: true });
      return listr.run();
    });
};

export default pageLoader;
