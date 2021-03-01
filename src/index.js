// import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';
import url from 'url';


const defaultPath = process.cwd();
const getFileName = (url) => {
  // const newPath = `${url.split('://')[1].replace(/\//g, '-')}.html`;
  const newPath = `${url.split('://')[1].replace(/[^a-zA-ZА-Яа-я0-9]/g, '-')}.html`;
  return newPath;
};

const getImageName = (url) => {
  // const newPath = `${url.split('://')[1].replace(/\//g, '-')}.html`;
  const newPath = `${url.split('://')[1].replace(/[^a-zA-ZА-Яа-я0-9]/g, '-')}.png`;
  return newPath;
};

const getLinkName = (url) => {
  // const newPath = `${url.split('://')[1].replace(/\//g, '-')}.html`;
  const newPath = `${url.split('://')[1].replace(/[^a-zA-ZА-Яа-я0-9]/g, '-')}.css`;
  return newPath;
};

const getJSName = (url) => {
  // const newPath = `${url.split('://')[1].replace(/\//g, '-')}.html`;
  const newPath = `${url.split('://')[1].replace(/[^a-zA-ZА-Яа-я0-9]/g, '-')}.js`;
  return newPath;
};

const getFilesDirectoryName = (url) => {
  // const newPath = `${url.split('://')[1].replace(/\//g, '-')}.html`;
  const newPath = `${url.split('://')[1].replace(/[^a-zA-ZА-Яа-я0-9]/g, '-')}_files`;
  return newPath;
};

const downLoadImage = (imagePath, downLoadPath) => {
  // const url = 'https://unsplash.com/photos/AaEQmoufHLk/download?force=true'
  // const path = Path.resolve(__dirname, 'images', 'code.jpg')
  const writer = fs.createWriteStream(downLoadPath);

  axios({
    method: 'get',
    url: imagePath,
    responseType: 'stream',
  })
    .then(function (response) {
      response.data.pipe(writer)
    });

  // response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const downLoadStylesAndJS = (resourcePath, downLoadPath) => {
  const writer = fs.createWriteStream(downLoadPath);

  axios({
    method: 'get',
    url: resourcePath,
    responseType: 'stream',
  })
    .then(function (response) {
      response.data.pipe(writer)
    });

  // response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const pageLoader = (urlString = '', outputPath = defaultPath) => {
  const fileName = getFileName(urlString);
  const myUrl = new URL(urlString);
  const base = myUrl.origin;
  const filesDirectoryName = getFilesDirectoryName(urlString);
  const filesDirectoryPath = path.resolve(outputPath, filesDirectoryName);
  fs.mkdir(filesDirectoryPath, (error) => {
    if (error) {
      console.log(error);
    }
    // console.log('File has been written');
  });
  // console.log(filesDirectoryName);
  return axios.get(urlString)
    .then(({ data }) => {
      // return data;
      // console.log(outputPath);
      // console.log(fileName);
      const $ = cheerio.load(data);
      const imageLinks = $('img');
      imageLinks.each(function () {
        const link = $(this).attr('src');
        const fullImagePath = url.resolve(base, link);
        const fullImageName = getImageName(fullImagePath);
        const fullImageDownLoadPath = path.resolve(filesDirectoryPath, fullImageName);
        // console.log(fullImageName);
        // console.log(fullImagePath);
        downLoadImage(fullImagePath, fullImageDownLoadPath);
        $(this).attr('src', fullImageDownLoadPath);
      });

      // const linkLinks = $('link');

      // linkLinks.each(function () {
      //   const link = $(this).attr('href');
      //   const fullLinkPath = url.resolve(base, link);
      //   const fullLinkName = getLinkName(fullLinkPath);
      //   const fullLinkDownLoadPath = path.resolve(filesDirectoryPath, fullLinkName);
      //   downLoadStylesAndJS(fullLinkPath, fullLinkDownLoadPath);
      //   $(this).attr('href', fullLinkDownLoadPath);
      // });

      // const scriptLinks = $('script');

      // scriptLinks.each(function () {
      //   const link = $(this).attr('src');
      //   if (link) {
      //     const fullLinkPath = url.resolve(base, link);
      //     console.log(fullLinkPath);
      //     const fullLinkName = getJSName(fullLinkPath);
      //     const fullLinkDownLoadPath = path.resolve(filesDirectoryPath, fullLinkName);
      //     downLoadStylesAndJS(fullLinkPath, fullLinkDownLoadPath);
      //     $(this).attr('src', fullLinkDownLoadPath);
      //   }
      // });

      fs.writeFile(`${outputPath}/${fileName}`, `${$.html()}`, (error) => {
        if (error) {
          console.log(error);
        }
      });
    });
  // return 1;
};

export default pageLoader;
