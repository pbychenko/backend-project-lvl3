import { isValidUrl } from '../src/utils.js';

describe('Check validity of url', () => {
  test('check correct url', async () => {
    const correctUrl = 'https://testurl.com';
    const result = isValidUrl(correctUrl);

    expect(result).toBe(true);
  });

  test('check сorrect url without protocol', async () => {
    const correctUrl = 'testurl.com/path1/path2?a=1&b=2';
    const result = isValidUrl(correctUrl);

    expect(result).toBe(true);
  });

  test('check relative path', async () => {
    const relativePath = '/tesPath/someFile.js';
    const result = isValidUrl(relativePath);

    expect(result).toBe(false);
  });

  test('check localhost', async () => {
    const localhostUrl = 'http://localhost:8080';
    const result = isValidUrl(localhostUrl);

    expect(result).toBe(true);
  });

  test('check url without TLD', async () => {
    const incorrectUrl = 'http://site/somepath';
    const result = isValidUrl(incorrectUrl);

    expect(result).toBe(false);
  });
});
