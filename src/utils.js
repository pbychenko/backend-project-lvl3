import path from 'path';
import axios from 'axios';
import fs from 'fs';
import fsp from 'fs/promises';
import url from 'url';

const formatUrl = (url) => {
  return url.split('://')[1].replace(/[^a-zA-ZА-Яа-я0-9]/g, '-');
};

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
  // const newPath = `${url.split('://')[1].replace(/\//g, '-')}.html`;
  // const testPath = urlString.split('://')[1].replace(/\//g, '-');
  // console.log(path.parse(testPath));
  const tempPath = urlString.split('://')[1];
  // console.log(tempPath);
  const { dir, name } = path.parse(tempPath);
  // console.log(dir);
  // console.log(name);
  const formattedPath = `${dir}/${name}`;
  const newPath = `${formattedPath.replace(/[^a-zA-ZА-Яа-я0-9]/g, '-')}.${format}`;
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

// export const createResourceDirectory = (urlString, outputPath) => {
export const createResourceDirectory = (resourceFilesDirectoryPath) => {
  return fsp.mkdir(resourceFilesDirectoryPath)
    .then((dir) => dir)
    .catch((er) => {
      // console.log(er.message);
      console.error(er.message);
      // throw er;
      process.exit(er.errno);
    });
};

export const editResourcePathesInHtml = (links, type, resourceFilesDirectoryPath, $, myUrl) => {
  const map = {
    images: ['src', 'png'],
    styles: ['href', 'css'],
    scripts: ['src', 'js'],
  };

  // console.log('before');
  // console.log($);
  const [attribute, ext] = map[type];
  const base = myUrl.origin;
  const fullResourceDownLoadPathes = links.map(function () {
    const link = $(this).attr(attribute);
    // const context = this;
    if (link) {
      const fullResourcePath = url.resolve(base, link); //new URL(link, base)
      // const fullResourcePath = new URL(link, base);
      const fullResourceName = getResourceFileName(fullResourcePath, ext);
      // return { url: fullResourcePath, downloadPath: path.resolve(resourceFilesDirectoryPath, fullResourceName) };
      return downLoadResource(fullResourcePath, path.resolve(resourceFilesDirectoryPath, fullResourceName))
        .then((dowloadPath) => {
          // console.log(dowloadPath);
          // console.log()
          // console.log(context);
          // console.log(attribute);
          $(this).attr(attribute, dowloadPath);
          // return $;
        })
        .catch(() => console.log('some error again'));
    }
  }).toArray();

  const promise = Promise.all(fullResourceDownLoadPathes).then(() => $);
  return promise;
  // links.each(function () {
  //   const link = $(this).attr(attribute);

  //   if (link) {
  //     const fullResourcePath = url.resolve(base, link);
  //     const fullResourceName = getResourceFileName(fullResourcePath, ext);
  //     const fullResourceDownLoadPath = path.resolve(resourceFilesDirectoryPath, fullResourceName);
  //     downLoadResource(fullResourcePath, fullResourceDownLoadPath);
  //     $(this).attr(attribute, fullResourceDownLoadPath);
  //   }
  // });
};
