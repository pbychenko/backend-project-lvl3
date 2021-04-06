import commander from 'commander';
import { accessSync, constants } from 'fs';
// import debug from 'debug';
import pageLoader from './index.js';
// import { accessSync, constants } from 'fs';

// const logPageLoader = debug(pageLoader);

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const defaultPath = process.cwd();
// console.log(defaultPath);

const runApp = () => {
  const testPath = '/home/pavel/hexlet_projects/tet';
  // const testPath = '/sys';
  // pageLoader('http://www.perumov.club/books/11', testPath)
  //   .catch((er) => {
  //     console.error(er.message);

  //     process.exit(1);
  //   });
  // console.log(pageLoader('http://www.perumov.club/books/11', testPath));
  console.log(pageLoader('https://hexlet.io/', testPath));
  // console.log(pageLoader('https://fc-arsenal.com', testPath));
  // console.log(pageLoader('https://krisha.kz/', testPath));
  // commander.version('0.0.1')
  //   .description('Some description')
  //   .option('-out, --output [path]', 'Download path', defaultPath)
  //   .arguments('<url>')
  //   .action((url) => pageLoader(url, commander.output)
  //     // .then(() => {
  //     //   // console.log('all ok');
  //     //   // console.log(url);
  //     //   // console.log(commander.output);
  //     //   // process.exit();
  //     // })
  //     .catch((er) => {
  //       // console.error(er.message);
  //       // throw er;
  //       console.log('commander catch');
  //       console.error(er.message);
  //       // if (er.code === 'EACCES') {
  //         throw er;
  //       // }
  //       // process.exit(1);
  //     }))
  //   .parse(process.argv);
  // try {
  // //   accessSync(commander.output, constants.R_OK | constants.W_OK);
  //   commander.parse(process.argv);
  // } catch (err) {
  //   // console.log('hui');
  //   // console.error(err.message);
  //   throw err;
  // }
};

export default runApp;
