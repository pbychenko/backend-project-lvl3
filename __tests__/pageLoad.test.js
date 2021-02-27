// import fs from 'fs';
import nock from 'nock';
import { promises as fsp } from 'fs';
import pageLoader from '../src';


// const jsonFilepath1 = `${__dirname}/__fixtures__/json/before.json`;
// const jsonFilepath2 = `${__dirname}/__fixtures__/json/after.json`;

// beforeAll(() => {
//   const scope = nock('https://testUrl.com').get('/tests').reply(200, '<html>some content</html>');
// });

describe('Check download html to file', () => {
  // const expPath = `${__dirname}/__fixtures__/results/simpleRenderExpectedResult`;
  // const expected = fs.readFileSync(`${expPath}`, 'utf8');

  test('1', async () => {
    const host = 'https://testurl.com';
    nock(host).get('/test1').reply(200, '<html>some content</html>');
    const expPath = `${__dirname}`;
    // console.log(expPath);
    await pageLoader('https://testurl.com/test1', expPath);
    const result = await fsp.readFile(`${expPath}/testurl-com-test1.html`, 'utf8');
    expect(result).toBe('<html>some content</html>');
  });

  // test('Check yaml files', () => {
  //   expect(genDiff(yamlFilepath1, yamlFilepath2, 'simple')).toBe(expected);
  // });
});
