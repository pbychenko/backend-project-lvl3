import path from 'path';
import axios from 'axios';
import fs from 'fs';
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

export const createResourceDirectory = (urlString, outputPath) => {
  const resourceFilesDirectoryName = getResourceFilesDirectoryName(urlString);
  const resourceFilesDirectoryPath = path.resolve(outputPath, resourceFilesDirectoryName);
  fs.mkdir(resourceFilesDirectoryPath, (error) => {
    if (error) {
      console.log(error);
    }
  });
  return resourceFilesDirectoryPath;
};

export const formatResourcesInHtml = (links, type, resourceFilesDirectoryPath, $, myUrl) => {
  const mapTypeToAttribute = {
    images: 'src',
    styles: 'href',
    scripts: 'src',
  };

  const mapTypeToExt = {
    images: 'png',
    styles: 'css',
    scripts: 'js',
  };

  const base = myUrl.origin;

  links.each(function () {
    // const link = $(this).attr('src');
    const link = $(this).attr(mapTypeToAttribute[type]);
    if (link) {
      const fullResourcePath = url.resolve(base, link);
      const fullResourceName = getResourceFileName(fullResourcePath, mapTypeToExt[type]);
      const fullResourceDownLoadPath = path.resolve(resourceFilesDirectoryPath, fullResourceName);
      downLoadResource(fullResourcePath, fullResourceDownLoadPath);
      $(this).attr(mapTypeToAttribute[type], fullResourceDownLoadPath);
    }
  });
};
