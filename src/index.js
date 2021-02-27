// import _ from 'lodash';
// import path from 'path';
import fs from 'fs';
// import parse from './parser';
// import render from './formatters';

import axios from 'axios';

// const getAst = (beforeContent, afterContent) => {
//   const uniqKeys = _.union(Object.keys(beforeContent), Object.keys(afterContent));
//   const getAstElement = (key) => {
//     if (beforeContent[key] instanceof Object && afterContent[key] instanceof Object) {
//       return { key, state: 'nested', children: getAst(beforeContent[key], afterContent[key]) };
//     }

//     if (_.has(beforeContent, key) && _.has(afterContent, key)) {
//       if (beforeContent[key] === afterContent[key]) {
//         return { key, state: 'equal', value: beforeContent[key] };
//       }

//       return {
//         key, state: 'changed', value: beforeContent[key], newValue: afterContent[key],
//       };
//     }

//     if (_.has(beforeContent, key)) {
//       return { key, state: 'removed', value: beforeContent[key] };
//     }

//     return { key, state: 'added', value: afterContent[key] };
//   };
//   return uniqKeys.map(getAstElement);
// };
const defaultPath = process.cwd();
const getFileName = (url) => {
  // const urlObj = new URL(url);
  // return urlObj.hostname;
  const newPath = `${url.split('://')[1].replaceAll('/', '-')}.html`;
  return newPath;
};

const pageLoader = (url = '', outputPath = defaultPath) => {
  // console.log(url);
  // console.log(outputPath);
  // console.log(process.cwd());
  const fileName = getFileName(url);
  axios.get(url)
    .then(({ data }) => {
      // console.log(data);
      fs.writeFile(`${outputPath}/${fileName}`, `${data}`, (_error3) => {
        console.log('File has been written');
      });
    });
  // return 1;
  // return [url, outputPath];

  // return 'test11';
  // console.log('test11');

  //   const extName1 = path.extname(pathToFile1).slice(1);
  //   const extName2 = path.extname(pathToFile2).slice(1);

  //   const fileData1 = fs.readFileSync(pathToFile1, 'utf8');
  //   const fileData1Obj = parse(fileData1, extName1);

  //   const fileData2 = fs.readFileSync(pathToFile2, 'utf8');
  //   const fileData2Obj = parse(fileData2, extName2);

  //   const ast = getAst(fileData1Obj, fileData2Obj);

  //   return render(ast, type);
};

// pageLoader(url, outputPath);

export default pageLoader;
