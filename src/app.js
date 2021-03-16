import commander from 'commander';
// import debug from 'debug';
import pageLoader from './index.js';

// const logPageLoader = debug(pageLoader);

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const defaultPath = process.cwd();
// console.log(defaultPath);

const runApp = () => {
  // const testPath = '/home/pavel/hexlet_projects/tet';
  // console.log(pageLoader('https://fc-arsenal.com/pered-matchem/mikel-arteta-rodzhers-zasluzhivaet-priz-luchshemu-treneru-sezona', testPath));
  // console.log(pageLoader('https://ru.hexlet.io/projects/', testPath));
  commander.version('0.0.1')
    .description('Some description')
    .option('-out, --output [path]', 'Download path', defaultPath)
    .arguments('<url>')
    .action((url) => {
      return pageLoader(url, commander.output)
      .then(() => {
        console.log('all ok');
        console.log(url);
        console.log(commander.output);
        // process.exit();
      })
      .catch((er) => {
        // console.error(er.message);
        // throw er;
        console.error('tut');
        process.exit(1);        
      })
      // console.log(result);
    })
    .parse(process.argv);
};

export default runApp;
