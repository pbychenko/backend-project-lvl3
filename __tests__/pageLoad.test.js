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
  resultDirectory = path.join(os.tmpdir(), 'page-loader-');
  resultDirectory = await fsp.mkdtemp(resultDirectory);
});

describe('Check download html to file', () => {
  // const expPath = `${__dirname}/__fixtures__/results/simpleRenderExpectedResult`;
  // const expected = fs.readFileSync(`${expPath}`, 'utf8');

  test('check valid url with simple content', async () => {
    const host = 'https://testurl.com';
    nock(host).get('/test1').reply(200, '<html><head></head><body>some content</body></html>');
  
    await pageLoader('https://testurl.com/test1', resultDirectory);
    const result = await fsp.readFile(`${resultDirectory}/testurl-com-test1.html`, 'utf8');

    expect(result).toBe('<html><head></head><body>some content</body></html>');
  });

  // test('check valid url with images in different formats', async () => {
  //   const host = 'https://testurl.com';
  //   const initialHtml = `<html><head></head><body>
  //     <img src="/pictures/p1.png" />
  //     </body></html>`;
  //   nock(host).get('/test2/images').reply(200, initialHtml);
    
  //   // const { name } = path.parse(resultDirectory);      
  //   await pageLoader('https://testurl.com/test2/images', resultDirectory);
  //   const expectedHtml = `<html><head></head><body>
  //     <img src="testurl-com-test2-images_files/testurl-com-pictures-p1.png" />
  //     </body></html>`;
  //   const result = await fsp.readFile(`${resultDirectory}/testurl-com-test2-images.html`, 'utf8');

  //   expect(result).toBe(expectedHtml);
  // });

  

//   // test('Check yaml files', () => {
//   //   expect(genDiff(yamlFilepath1, yamlFilepath2, 'simple')).toBe(expected);
//   // });
});
