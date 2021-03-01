import { getResourceFilesDirectoryName } from '../src/utils';

describe('Check files directory name generation', () => {
  test('check simple url', async () => {
    const simpleUrl = 'https://testurl.com';
    const result = getResourceFilesDirectoryName(simpleUrl);
    expect(result).toBe('testurl-com_files');
  });

  test('check url with path and params', async () => {
    const simpleUrl = 'https://testurl.com/path1/path2?a=1&b=2';
    const result = getResourceFilesDirectoryName(simpleUrl);
    expect(result).toBe('testurl-com-path1-path2-a-1-b-2_files');
  });

  test('check url ended on .[format]', async () => {
    const simpleUrl = 'https://testurl.com/index.html';
    const result = getResourceFilesDirectoryName(simpleUrl);
    expect(result).toBe('testurl-com-index-html_files');
  });

  // test('check url without potocol', async () => {
  //   const simpleUrl = 'testurl.com';
  //   const result = getResourceFilesDirectoryName(simpleUrl);
  //   expect(result).toBe('testurl-com');
  // });
});
