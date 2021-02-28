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
    writer.on('finish', resolve)
    writer.on('error', reject)
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
  console.log(filesDirectoryName);
  return axios.get(urlString)
    .then(({ data }) => {
      // return data;
      // console.log(outputPath);
      // console.log(fileName);
      const $ = cheerio.load(data);
      const relativeLinks = $('img');
      relativeLinks.each(function() {
        const link = $(this).attr('src');
        const fullImagePath = url.resolve(base, link);
        const fullImageName = getImageName(fullImagePath);
        const fullImageDownLoadPath = path.resolve(filesDirectoryName, fullImageName);
        console.log(fullImageName);
        console.log(fullImagePath);
        downLoadImage(fullImagePath, fullImageDownLoadPath);
        // download(base+link,link,function()
        //         {
        //     console.log("wao great we done this...THINK DIFFERENT")
        // })
      // });
      });
      // fs.writeFile(`${outputPath}/${fileName}`, `${data}`, (error) => {
      //   if (error) {
      //     console.log(error);
      //   }
      //   // console.log('File has been written');
      // });
    });
  // return 1;
};

export default pageLoader;
