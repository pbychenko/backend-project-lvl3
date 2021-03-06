// import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';
// import url from 'url';

import {
  getResourceFilesDirectoryName,
  getHtmlFileName, //getResourceFileName,
  // downLoadResource,
  createResourceDirectory, editResourcePathesInHtml,
} from './utils';

const defaultDirectory = process.cwd();

const pageLoader = (urlString = '', outputPath = defaultDirectory) => {
  const htmlFileName = getHtmlFileName(urlString);
  const myUrl = new URL(urlString);
  const resourceFilesDirectoryName = getResourceFilesDirectoryName(urlString);
  const resourceFilesDirectory = path.join(outputPath, resourceFilesDirectoryName);
  // const resourceFilesDirectory = createResourceDirectory(urlString, outputPath);
  // createResourceDirectory(resourceFilesDirectory);
  // console.log('test')

  // return axios.get(urlString)
  //   .then(({ data }) => {
  //     const $ = cheerio.load(data);
  //     const imageLinks = $('img');
  //     formatResourcesInHtml(imageLinks, 'images', resourceFilesDirectory, $, myUrl);

  //     const stylesLinks = $('link[rel="stylesheet"]');
  //     formatResourcesInHtml(stylesLinks, 'styles', resourceFilesDirectory, $, myUrl);

  //     const scriptLinks = $('script');
  //     formatResourcesInHtml(scriptLinks, 'scripts', resourceFilesDirectory, $, myUrl);

  //     fs.writeFile(`${outputPath}/${htmlFileName}`, `${$.html()}`, (error) => {
  //       if (error) {
  //         console.log(error);
  //       }
  //     });
  //   });
  return createResourceDirectory(resourceFilesDirectory).then(() => {
    axios.get(urlString)
      .then(({ data }) => {
        const $ = cheerio.load(data);

        const imageLinks = $('img');
        editResourcePathesInHtml(imageLinks, 'images', resourceFilesDirectory, $, myUrl);

        const stylesLinks = $('link[rel="stylesheet"]');
        editResourcePathesInHtml(stylesLinks, 'styles', resourceFilesDirectory, $, myUrl);

        const scriptLinks = $('script');
        editResourcePathesInHtml(scriptLinks, 'scripts', resourceFilesDirectory, $, myUrl);

        fs.writeFile(`${outputPath}/${htmlFileName}`, `${$.html()}`, (error) => {
          if (error) {
            console.log(error);
          }
        });
      });
  });
};

export default pageLoader;
