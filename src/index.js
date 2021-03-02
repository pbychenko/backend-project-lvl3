// import _ from 'lodash';
// import path from 'path';
import fs from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';
// import url from 'url';

import {
  // getResourceFilesDirectoryName,
  getHtmlFileName, //getResourceFileName,
  // downLoadResource,
  createResourceDirectory, formatResourcesInHtml,
} from './utils';

const defaultPath = process.cwd();

const pageLoader = (urlString = '', outputPath = defaultPath) => {
  const htmlFileName = getHtmlFileName(urlString);
  const myUrl = new URL(urlString);
  const resourceFilesDirectoryPath = createResourceDirectory(urlString, outputPath);
  return axios.get(urlString)
    .then(({ data }) => {
      const $ = cheerio.load(data);
      const imageLinks = $('img');
      formatResourcesInHtml(imageLinks, 'images', resourceFilesDirectoryPath, $, myUrl);

      const stylesLinks = $('link[rel="stylesheet"]');
      formatResourcesInHtml(stylesLinks, 'styles', resourceFilesDirectoryPath, $, myUrl);

      const scriptLinks = $('script');
      formatResourcesInHtml(scriptLinks, 'scripts', resourceFilesDirectoryPath, $, myUrl);

      fs.writeFile(`${outputPath}/${htmlFileName}`, `${$.html()}`, (error) => {
        if (error) {
          console.log(error);
        }
      });
    });
};

export default pageLoader;
