import path from 'path';
import { promises as fsp } from 'fs';
// import { constants, promises as fsp } from 'fs';

import axios from 'axios';
import cheerio from 'cheerio';
import Listr from 'listr';
// import url from 'url';

import {
  generateResourceFilesDirectoryName,
  generateHtmlFileName,
  isValidUrl,
  // getResourceFileName,
  // downLoadResource,
  createResourceDirectory, editResourcePathesInHtml, downloadResourcesByType,
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
  const locs = ['img', 'link[rel="stylesheet"]', 'script'];
  const map = {
    img: 'images',
    'link[rel="stylesheet"]': 'styles',
    script: 'scripts',
  };
  let initHtml;
  let cheerioObj;
  let cheerioObjCopy;

  // return createResourceDirectory(outputPath, resourceFilesDirectory)
  //   .then(() => axios.get(url))
  //   .then(({ data }) => {
  //     initHtml = data;
  //     return cheerio.load(data);
  //   })
  //   // .then(($) => {
  //   //   const imageLinks = $('img');
  //   //   return editResourcePathesInHtml(imageLinks, 'images', resourceFilesDirectory, $, myUrl);
  //   // })
  //   // .then(($) => {
  //   //   const stylesLinks = $('link[rel="stylesheet"]');
  //   //   return editResourcePathesInHtml(stylesLinks, 'styles', resourceFilesDirectory, $, myUrl);
  //   // })
  //   // .then(($) => {
  //   //   const scriptLinks = $('script');
  //   //   return editResourcePathesInHtml(scriptLinks, 'scripts', resourceFilesDirectory, $, myUrl);
  //   // })
  //   .then(($) => {
  //     // console.log('can');
  //     const canonicalElement = $('link[rel="canonical"]');
  //     if (canonicalElement) {
  //       const link = canonicalElement.attr('href');
  //       if (link) {
  //         canonicalElement.attr('href', `${resourceFilesDirectoryName}/${htmlFileName}`);
  //       }
  //     }

  //     const tasks = locs.map((loc) => (
  //       {
  //         title: `Download ${loc}`,
  //         task: () => {
  //           const links = $(loc);
  //           return editResourcePathesInHtml(links, map[loc], resourceFilesDirectory, $, myUrl);
  //         },
  //       }));
  //     const listr = new Listr(tasks, { concurrent: true });
  //     return listr.run().then(() => $);
  //   })
  //   .then(($) => {
  //     // console.log('her12e');
  //     fsp.writeFile(`${outputPath}/${htmlFileName}`, `${$.html()}`);
  //     fsp.writeFile(`${outputPath}/${resourceFilesDirectoryName}/${htmlFileName}`, `${initHtml}`);
  //   });
  return axios.get(url)
    .then(({ data }) => {
      initHtml = data;
      // cheerioObj = cheerio.load(data);
      // console.log(cheerioObj);
      
      // console.log('hui');
      // console.log(cheerioObj);
      return cheerio.load(data);
    })
    .then(($) => {
      cheerioObjCopy = $;
      const canonicalElement = $('link[rel="canonical"]');
      if (canonicalElement) {
        const link = canonicalElement.attr('href');
        if (link) {
          canonicalElement.attr('href', `${resourceFilesDirectoryName}/${htmlFileName}`);
        }
      }

      locs.forEach((loc) => {
        const links = $(loc);
        editResourcePathesInHtml(links, map[loc], resourceFilesDirectoryPath, $, myUrl);
      });

      return $;
    })
    .then(($) => fsp.writeFile(`${outputPath}/${htmlFileName}`, `${$.html()}`))
    .then(() => createResourceDirectory(outputPath, resourceFilesDirectoryPath))
    .then(() => fsp.writeFile(`${outputPath}/${resourceFilesDirectoryName}/${htmlFileName}`, `${initHtml}`))
    .then(() => {
      const tasks = locs.map((loc) => (
        {
          title: `Download ${map[loc]}`,
          task: () => {
            const links = cheerioObjCopy(loc);
            return downloadResourcesByType(links, map[loc], resourceFilesDirectoryPath, cheerioObjCopy, myUrl);
          },
        }));
      const listr = new Listr(tasks, { concurrent: true });
      return listr.run();
    });
};

export default pageLoader;
