// import commander from 'commander';
import pageLoader from '.';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const runApp = () => {
  const testPath = '/home/pavel/projects/catalog';
  // console.log(pageLoader('https://fc-arsenal.com/pered-matchem/mikel-arteta-rodzhers-zasluzhivaet-priz-luchshemu-treneru-sezona', testPath));
  console.log(pageLoader('https://ru.hexlet.io/projects/', testPath));
  // console.log(pageLoader('https://fc-arsenal.com'));
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
