import path from 'path';
import axios from 'axios';
import fs, { constants as constants, promises as fsp } from 'fs';

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

// export const getResourceFileName = (urlString, format) => {
export const getResourceFileName = (urlString) => {
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
    .then(() => downLoadPath)
    .catch((er) => {
      console.error('file cant be downloaded');
      throw er;
      // process.exit(er.errno);
    });
};

export const createResourceDirectory = (resourceFilesDirectoryPath) => (
  // fsp.access(outputPath, constants.W_OK)
  fsp.mkdir(resourceFilesDirectoryPath)
    .then((dir) => dir)
    .catch((er) => {
      console.error(er.message);
      // console.log('huy')
      throw er;
      // process.exit(er.errno);
    })
);

export const editResourcePathesInHtml = (links, type, resourceFilesDirectoryPath, $, myUrl) => {
  const map = {
    images: ['src'],
    styles: ['href'],
    scripts: ['src'],
  };

  // const [attribute, ext] = map[type];
  const [attribute] = map[type];
  const base = myUrl.origin;
  const promises = links.map(function () {
    const link = $(this).attr(attribute);
    if (link) {
      if (!isValidUrl(link) || ((new URL(link)).origin === base)) {
        const { href } = new URL(link, base);
        const fullResourceName = getResourceFileName(href);
        // console.log(fullResourceName);
        return downLoadResource(href, path.resolve(resourceFilesDirectoryPath, fullResourceName))
          .then(() => {
            const { name } = path.parse(resourceFilesDirectoryPath);
            $(this).attr(attribute, `${name}/${fullResourceName}`);
          })
          .catch(() => console.log('some error again'));
      }
    }
  }).toArray();

  const promise = Promise.all(promises).then(() => $);
  return promise;
};
