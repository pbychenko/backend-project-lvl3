import path from 'path';
import axios from 'axios';
import fs, { promises as fsp } from 'fs';

const formatUrl = (url) => url.split('://')[1].replace(/[^a-zA-ZА-Яа-я0-9]/g, '-');

export const isValidUrl = (url) => {
  try {
    return new URL(url, url) && true;
  } catch {
    return false;
  }
};

export const getResourceFilesDirectoryName = (urlString) => {
  const filesDirectory = `${formatUrl(urlString)}_files`;
  return filesDirectory;
};

export const getHtmlFileName = (urlString) => {
  const newPath = `${formatUrl(urlString)}.html`;
  return newPath;
};

export const getResourceFileName = (urlString, format) => {
  const newPath = `${formatUrl(urlString)}.${format}`;
  return newPath;
};


export const downLoadResource = (resourcePath, downLoadPath) => {
  const writer = fs.createWriteStream(downLoadPath);

  return axios({
    method: 'get',
    url: resourcePath,
    responseType: 'stream',
  })
    .then((response) => response.data.pipe(writer))
    .then(() => downLoadPath)
    .catch((er) => {
      console.error('file cant be downloaded');
      process.exit(er.errno);
    });
};

export const createResourceDirectory = (resourceFilesDirectoryPath) => (
  fsp.mkdir(resourceFilesDirectoryPath)
    .then((dir) => dir)
    .catch((er) => {
      console.error(er.message);
      process.exit(er.errno);
    })
);


export const editResourcePathesInHtml = (links, type, resourceFilesDirectoryPath, $, myUrl) => {
  const map = {
    images: ['src', 'png'],
    styles: ['href', 'css'],
    scripts: ['src', 'js'],
  };

  const [attribute, ext] = map[type];
  const base = myUrl.origin;
  const promises = links.map(function () {
    const link = $(this).attr(attribute);
    if (link) {
      if (!isValidUrl(link)) {
        const { href } = new URL(link, base);
        const fullResourceName = getResourceFileName(href, ext);
        return downLoadResource(href, path.resolve(resourceFilesDirectoryPath, fullResourceName))
          .then((dowloadPath) => {
            $(this).attr(attribute, dowloadPath);
          })
          .catch(() => console.log('some error again'));
      }
    }
  }).toArray();

  const promise = Promise.all(promises).then(() => $);
  return promise;
};
