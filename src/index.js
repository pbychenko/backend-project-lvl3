// import _ from 'lodash';
// import path from 'path';
// import fs from 'fs';
// import parse from './parser';
// import render from './formatters';

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

const pageLoader = (url, outputPath) => {
  // console.log(url);
  // console.log(outputPath);
  return [url, outputPath];
  // return 'test';

  //   const extName1 = path.extname(pathToFile1).slice(1);
  //   const extName2 = path.extname(pathToFile2).slice(1);

  //   const fileData1 = fs.readFileSync(pathToFile1, 'utf8');
  //   const fileData1Obj = parse(fileData1, extName1);

  //   const fileData2 = fs.readFileSync(pathToFile2, 'utf8');
  //   const fileData2Obj = parse(fileData2, extName2);

  //   const ast = getAst(fileData1Obj, fileData2Obj);

  //   return render(ast, type);
};

export default pageLoader;
