import path from 'path';
import axios from 'axios';
import fs, { promises as fsp } from 'fs';
import isURL from 'validator/lib/isURL.js';

const formatUrl = (url) => url.split('://')[1].replace(/[^a-zA-ZА-Яа-я0-9]/g, '-');

export const isValidUrl = (url) => {
  // try {
  //   return new URL(url, url) && true;
  // } catch {
  //   return false;
  // }
  if (url.includes('localhost')) {
    return true;
  }
  return isURL(url);
};

export const generateResourceFilesDirectoryName = (urlString) => {
  const resourceFilesDirectoryName = `${formatUrl(urlString)}_files`;
  return resourceFilesDirectoryName;
};

export const generateHtmlFileName = (urlString) => {
  const newPath = `${formatUrl(urlString)}.html`;
  return newPath;
};

export const generateResourceFileName = (urlString) => {
  const tempPath = urlString.split('://')[1];
  const { dir, name, ext } = path.parse(tempPath);
  // console.log(name);
  const formattedPath = `${dir}/${name}`;
  const newPath = `${formattedPath.replace(/[^a-zA-ZА-Яа-я0-9]/g, '-')}${ext}`;
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
    .catch((er) => {
      console.error('file cant be downloaded');
      throw er;
      // process.exit(er.errno);
    });
};

export const createResourceDirectory = (outputPath, resourceFilesDirectoryPath) => (
  // fsp.access(outputPath)
  // .then(() => fsp.mkdir(resourceFilesDirectoryPath))
  fsp.mkdir(resourceFilesDirectoryPath)
  // .catch((er) => {
  //   console.error('ss');
  //   throw er;
  //   // throw new Error('Directory ca');
  //   // process.exit(er.errno);
  // })
);

export const editResourcePathesInHtml = (selector, type, directoryPath, $, myUrl, originalUrls) => {
  const map = {
    images: ['src'],
    styles: ['href'],
    scripts: ['src'],
  };

  const [attribute] = map[type];
  const base = myUrl.origin;
  const links = $(selector);

  links.each(function () {
    const link = $(this).attr(attribute);
    // console.log(link);
    // console.log(isValidUrl(link));
    if (link && (!isValidUrl(link) || ((new URL(link)).origin === base))) {
      const { href } = new URL(link, base);
      originalUrls[type].push(href);
      const fullResourceName = generateResourceFileName(href);
      // console.log(fullResourceName);
      const { name } = path.parse(directoryPath);

      $(this).attr(attribute, `${name}/${fullResourceName}`);
    }
  });
};

export const downloadResources = (links, resourceFilesDirectoryPath, myUrl) => {
  const base = myUrl.origin;
  const promises = links.map((link) => {
    if (link) {
      if (!isValidUrl(link) || ((new URL(link)).origin === base)) {
        const { href } = new URL(link, base);
        const fullResourceName = generateResourceFileName(href);
        return downLoadResource(href, path.resolve(resourceFilesDirectoryPath, fullResourceName))
          .catch((er) => {
            // console.log(er.message)
            throw er;
          });
      }
    }
    return null;
  });

  const promise = Promise.all(promises);
  return promise;
};
