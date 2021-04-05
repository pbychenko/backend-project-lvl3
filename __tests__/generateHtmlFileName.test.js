import { generateHtmlFileName } from '../src/utils.js';

describe('Check files directory name generation', () => {
  test('check simple url', async () => {
    const simpleUrl = 'https://testurl.com';
    const result = generateHtmlFileName(simpleUrl, 'html');

    expect(result).toBe('testurl-com.html');
  });

  test('check url with path and params', async () => {
    const complexUrl = 'https://testurl.com/path1/path2?a=1&b=2';
    const result = generateHtmlFileName(complexUrl, 'html');

    expect(result).toBe('testurl-com-path1-path2-a-1-b-2.html');
  });

  test('check url ended on .[format]', async () => {
    const simpleUrl = 'https://testurl.com/index.html';
    const result = generateHtmlFileName(simpleUrl, 'html');

    expect(result).toBe('testurl-com-index-html.html');
  });
});
