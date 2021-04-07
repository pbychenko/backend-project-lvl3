import commander from 'commander';
// import debug from 'debug';
import pageLoader from './index.js';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const defaultPath = process.cwd();
// console.log(defaultPath);

const runApp = () => {
  // const testPath = '/home/pavel/projects/tet';
  // const testPath = '/sys';
  // console.log(pageLoader('http://www.perumov.club/books/11', testPath));
  // console.log(pageLoader('https://hexlet.io/', testPath));
  // console.log(pageLoader('https://localhost/', testPath));
  commander.version('0.0.1')
    .description('Some description')
    .option('-out, --output [path]', 'Download path', defaultPath)
    .arguments('<url>')
    .action((url) => pageLoader(url, commander.output)
      .catch((er) => {
        // console.error(er.message);
        // throw er;
        console.log('commander catch');
        console.error(er.message);
        // if (er.code === 'EACCES') {
          // throw er;
        // }
        process.exit(1);
      }))
    .parse(process.argv);
};

export default runApp;
