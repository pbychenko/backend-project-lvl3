// import _ from 'lodash';
// import path from 'path';
import fs from 'fs';
import axios from 'axios';

const defaultPath = process.cwd();
const getFileName = (url) => {
  // const newPath = `${url.split('://')[1].replace(/\//g, '-')}.html`;
  const newPath = `${url.split('://')[1].replace(/[^a-zA-ZА-Яа-я0-9]/g, '-')}.html`;
  return newPath;
};

const pageLoader = (url = '', outputPath = defaultPath) => {
  const fileName = getFileName(url);
  return axios.get(url)
    .then(({ data }) => {
      // return data;
      console.log(outputPath);
      console.log(fileName);
      fs.writeFile(`${outputPath}/${fileName}`, `${data}`, (error) => {
        if (error) {
          console.log(error);
        }
        // console.log('File has been written');
      });
    });
  // return 1;
};

export default pageLoader;
