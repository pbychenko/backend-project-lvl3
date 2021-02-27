import commander from 'commander';
import pageLoader from '.';

const runApp = () => {
  // console.log('here')
  console.log(pageLoader('test.ru', 'process.cwd()'));
  // commander.version('0.0.1')
  //   .description('Some description')
  //   .option('-out, --output [path]', 'Download path', 'process.cwd()')
  //   .arguments('<url>')
  //   .action((url) => {
  //     console.log(pageLoader(url, commander.output));
  //   })
  //   .parse(process.argv);
};


export default runApp;
