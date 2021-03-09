// import _ from 'lodash';
import path from 'path';
import { promises as fsp } from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';
// import url from 'url';

import {
  getResourceFilesDirectoryName,
  getHtmlFileName,
  // getResourceFileName,
  // downLoadResource,
  createResourceDirectory, editResourcePathesInHtml,
} from './utils';

const defaultDirectory = process.cwd();

const pageLoader = (urlString = '', outputPath = defaultDirectory) => {
  const htmlFileName = getHtmlFileName(urlString);
  const myUrl = new URL(urlString);
  const resourceFilesDirectoryName = getResourceFilesDirectoryName(urlString);
  const resourceFilesDirectory = path.join(outputPath, resourceFilesDirectoryName);
  return createResourceDirectory(resourceFilesDirectory)
    .then(() => axios.get(urlString))
    .then(({ data }) => cheerio.load(data))
    .then(($) => {
      const imageLinks = $('img');
      return editResourcePathesInHtml(imageLinks, 'images', resourceFilesDirectory, $, myUrl);
    })
    .then(($) => {
      const stylesLinks = $('link[rel="stylesheet"]');
      return editResourcePathesInHtml(stylesLinks, 'styles', resourceFilesDirectory, $, myUrl);
    })
    .then(($) => {
      const scriptLinks = $('script');
      // console.log('here');
      return editResourcePathesInHtml(scriptLinks, 'scripts', resourceFilesDirectory, $, myUrl);
    })
    .then(($) => {
      // console.log('her12e');
      fsp.writeFile(`${outputPath}/${htmlFileName}`, `${$.html()}`);
    })
    .catch((er) => console.log(er));
};

export default pageLoader;
