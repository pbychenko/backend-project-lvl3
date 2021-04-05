import nock from 'nock';
import { promises as fsp } from 'fs';
import os from 'os';
import path from 'path';
import pageLoader from '../src';

let resultDirectory;

beforeEach(async () => {
  resultDirectory = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

describe('Check download html to file', () => {
  test('check valid url with simple content', async () => {
    const host = 'https://testurl.com';
    nock(host).get('/test1').reply(200, '<html><head></head><body>some content</body></html>');

    await pageLoader('https://testurl.com/test1', resultDirectory);
    const result = await fsp.readFile(`${resultDirectory}/testurl-com-test1.html`, 'utf8');

    expect(result).toBe('<html><head></head><body>some content</body></html>');
  });

  // test('check invalid url', async () => {
  //   await expect(pageLoader('testurl.com/test1', resultDirectory)).rejects.toMatch('error');
  // });

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
});
