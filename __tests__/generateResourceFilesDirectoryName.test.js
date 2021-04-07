import { generateResourceFilesDirectoryName } from '../src/utils.js';

describe('Check files directory name generation', () => {
  test('check simple url', async () => {
    const simpleUrl = 'https://testurl.com';
    const result = generateResourceFilesDirectoryName(simpleUrl);

    expect(result).toBe('testurl-com_files');
  });

  test('check url with path and params', async () => {
    const complexUrl = 'https://testurl.com/path1/path2?a=1&b=2';
    const result = generateResourceFilesDirectoryName(complexUrl);

    expect(result).toBe('testurl-com-path1-path2-a-1-b-2_files');
  });

  test('check url ended on .[format]', async () => {
    const simpleUrl = 'https://testurl.com/index.html';
    const result = generateResourceFilesDirectoryName(simpleUrl);

    expect(result).toBe('testurl-com-index-html_files');
  });
});
