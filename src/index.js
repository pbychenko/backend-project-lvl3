import path from 'path';
import { promises as fsp } from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';
import Listr from 'listr';
// import url from 'url';

import {
  getResourceFilesDirectoryName,
  getHtmlFileName,
  isValidUrl,
  // getResourceFileName,
  // downLoadResource,
  createResourceDirectory, editResourcePathesInHtml,
} from './utils';

const defaultDirectory = process.cwd();

const pageLoader = (url, outputPath = defaultDirectory) => {
  if (!isValidUrl(url)) {
    console.error('Please input correct url');
    process.exit();
  }

  const resourceFilesDirectoryName = getResourceFilesDirectoryName(url);
  const htmlFileName = getHtmlFileName(url);
  const myUrl = new URL(url);
  const resourceFilesDirectory = path.join(outputPath, resourceFilesDirectoryName);
  const locs = ['img', 'link[rel="stylesheet"]', 'script'];
  const map = {
    img: 'images',
    'link[rel="stylesheet"]': 'styles',
    script: 'scripts',
  };
  return createResourceDirectory(resourceFilesDirectory)
    .then(() => axios.get(url))
    .then(({ data }) => cheerio.load(data))
    // .then(($) => {
    //   const imageLinks = $('img');
    //   return editResourcePathesInHtml(imageLinks, 'images', resourceFilesDirectory, $, myUrl);
    // })
    // .then(($) => {
    //   const stylesLinks = $('link[rel="stylesheet"]');
    //   return editResourcePathesInHtml(stylesLinks, 'styles', resourceFilesDirectory, $, myUrl);
    // })
    // .then(($) => {
    //   const scriptLinks = $('script');
    //   return editResourcePathesInHtml(scriptLinks, 'scripts', resourceFilesDirectory, $, myUrl);
    // })
    .then(($) => {
      const tasks = locs.map((loc) => (
        {
          title: `Download ${loc}`,
          task: () => {
            const links = $(loc);
            return editResourcePathesInHtml(links, map[loc], resourceFilesDirectory, $, myUrl);
          },
        }));
      const listr = new Listr(tasks, { concurrent: true });
      return listr.run().then(() => $);
    })
    .then(($) => {
      console.log('her12e');
      fsp.writeFile(`${outputPath}/${htmlFileName}`, `${$.html()}`);
    })
    .catch((er) => console.log(er));
};

export default pageLoader;
