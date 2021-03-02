import { getHtmlFileName } from '../src/utils';

describe('Check files directory name generation', () => {
  test('check simple url', async () => {
    const simpleUrl = 'https://testurl.com';
    const result = getHtmlFileName(simpleUrl, 'html');
    expect(result).toBe('testurl-com.html');
  });

  test('check url with path and params', async () => {
    const simpleUrl = 'https://testurl.com/path1/path2?a=1&b=2';
    const result = getHtmlFileName(simpleUrl, 'html');
    expect(result).toBe('testurl-com-path1-path2-a-1-b-2.html');
  });

  test('check url ended on .[format]', async () => {
    const simpleUrl = 'https://testurl.com/index.html';
    const result = getHtmlFileName(simpleUrl, 'html');
    expect(result).toBe('testurl-com-index-html.html');
  });

  // test('check url without potocol', async () => {
  //   const simpleUrl = 'testurl.com';
  //   const result = getResourceFilesDirectoryName(simpleUrl);
  //   expect(result).toBe('testurl-com');
  // });
});
