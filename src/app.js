import commander from 'commander';
// import debug from 'debug';
import pageLoader from './index.js';

// const logPageLoader = debug(pageLoader);

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const defaultPath = process.cwd();
// console.log(defaultPath);

const runApp = () => {
  // const testPath = '/home/pavel/projects/tet';
  // const testPath = '/sys';
  // pageLoader('http://www.perumov.club/books/11', testPath)
  //   .catch((er) => {
  //     console.error(er.message);

  //     process.exit(1);
  //   });
  // console.log(pageLoader('http://www.perumov.club/books/11', testPath));
  // console.log(pageLoader('https://ru.hexlet.io', testPath));
  // console.log(pageLoader('https://fc-arsenal.com', testPath));
  // console.log(pageLoader('https://krisha.kz/', testPath));
  commander.version('0.0.1')
    .description('Some description')
    .option('-out, --output [path]', 'Download path', defaultPath)
    .arguments('<url>')
    .action((url) => pageLoader(url, commander.output)
      // .then(() => {
      //   // console.log('all ok');
      //   // console.log(url);
      //   // console.log(commander.output);
      //   // process.exit();
      // })
      .catch((er) => {
        // console.error(er.message);
        // throw er;
        console.error(er.message);
        process.exit(1);
      }))
    .parse(process.argv)
    .catch((er) => {
      // console.error(er.message);
      // throw er;
      console.error(er.message);
      process.exit(1);
    });
};

export default runApp;
