import path from 'path';
import axios from 'axios';
import fs from 'fs';
import fsp from 'fs/promises';
import url from 'url';

export const getResourceFilesDirectoryName = (urlString) => {
  // const myUrl = new URL('https://test.com');
  // console.log(myUrl);
  // console.log(url.parse('http://stackoverflow.com/questions/17184791.html'));
  const filesDirectory = `${urlString.split('://')[1].replace(/[^a-zA-ZА-Яа-я0-9]/g, '-')}_files`;
  return filesDirectory;
};

export const getHtmlFileName = (urlString) => {
  const newPath = `${urlString.split('://')[1].replace(/[^a-zA-ZА-Яа-я0-9]/g, '-')}.html`;
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

  axios({
    method: 'get',
    url: resourcePath,
    responseType: 'stream',
  })
    .then(function (response) {
      response.data.pipe(writer)
    });


  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

// export const createResourceDirectory = (urlString, outputPath) => {
export const createResourceDirectory = (resourceFilesDirectoryPath) => {
  // const resourceFilesDirectoryName = getResourceFilesDirectoryName(urlString);
  // const resourceFilesDirectoryPath = path.join(outputPath, resourceFilesDirectoryName);
  // fs.mkdir(resourceFilesDirectoryPath, (er) => {
  //   if (er) {
  //     console.log(er);
  //     throw er;
  //   }
  // });
  // return resourceFilesDirectoryPath;
  return fsp.mkdir(resourceFilesDirectoryPath)
    .then((dir) => {
      console.log(`${resourceFilesDirectoryPath} has been created`);
      return dir;
    })
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

  const [attribute, ext] = map[type];
  const base = myUrl.origin;
  // console.log(links.toArray());
  const fullResourceDownLoadPathes = links.map(function () {
    const link = $(this).attr(attribute);
    if (link) {
      const fullResourcePath = url.resolve(base, link);
      const fullResourceName = getResourceFileName(fullResourcePath, ext);
      return path.resolve(resourceFilesDirectoryPath, fullResourceName);
    }
  }).toArray();
  console.log(fullResourceDownLoadPathes);

  links.each(function () {
    const link = $(this).attr(attribute);

    if (link) {
      const fullResourcePath = url.resolve(base, link);
      const fullResourceName = getResourceFileName(fullResourcePath, ext);
      const fullResourceDownLoadPath = path.resolve(resourceFilesDirectoryPath, fullResourceName);
      downLoadResource(fullResourcePath, fullResourceDownLoadPath);
      $(this).attr(attribute, fullResourceDownLoadPath);
    }
  });
  // const promises = links.toArray().map((el) => {
  //   const link = el.attr(attribute);
  //   if (link) {
  //     const fullResourcePath = url.resolve(base, link);
  //     const fullResourceName = getResourceFileName(fullResourcePath, ext);
  //     const fullResourceDownLoadPath = path.resolve(resourceFilesDirectoryPath, fullResourceName);
  //     downLoadResource(fullResourcePath, fullResourceDownLoadPath);
  //     $(this).attr(attribute, fullResourceDownLoadPath);
  //   }
  // });

  // return Promise.all(promises);
};
