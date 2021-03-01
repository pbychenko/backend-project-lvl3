// import fs from 'fs';
import nock from 'nock';
import { promises as fsp } from 'fs';
import os from 'os';
import path from 'path';
import pageLoader from '../src';

// const jsonFilepath1 = `${__dirname}/__fixtures__/json/before.json`;
// const jsonFilepath2 = `${__dirname}/__fixtures__/json/after.json`;
let resultDirectory;

beforeEach(async () => {
  // const testPath = __dirname;
  // console.log(typeof testPath);
  resultDirectory = path.join(os.tmpdir(), 'page-loader-');
  // console.log(resultDirectory);

  // await fsp.mkdtemp(path.join('test', 'page-loader-'));
  resultDirectory = await fsp.mkdtemp(resultDirectory);
  // console.log(r);
  // console.log(resultDirectory);
});

describe('Check download html to file', () => {
  // const expPath = `${__dirname}/__fixtures__/results/simpleRenderExpectedResult`;
  // const expected = fs.readFileSync(`${expPath}`, 'utf8');

  test('1', async () => {
    const host = 'https://testurl.com';
    nock(host).get('/test1').reply(200, '<html><head></head><body>some content</body></html>');
    await pageLoader('https://testurl.com/test1', resultDirectory);
    // await pageLoader('https://testurl.com/test1');
    const result = await fsp.readFile(`${resultDirectory}/testurl-com-test1.html`, 'utf8');
    expect(result).toBe('<html><head></head><body>some content</body></html>');
    expect(1).toBe(1);
  });

//   // test('Check yaml files', () => {
//   //   expect(genDiff(yamlFilepath1, yamlFilepath2, 'simple')).toBe(expected);
//   // });
});
