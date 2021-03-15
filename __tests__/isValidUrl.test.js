import { isValidUrl } from '../src/utils.js';

describe('Check validity of url', () => {
  test('check correct url', async () => {
    const correctUrl = 'https://testurl.com';
    const result = isValidUrl(correctUrl);
    expect(result).toBe(true);
  });

  test('check incorrect url', async () => {
    const incorrectUrl = 'testurl.com/path1/path2?a=1&b=2';
    const result = isValidUrl(incorrectUrl);
    expect(result).toBe(false);
  });

  test('check relative path', async () => {
    const relativePath = '/tesPath/someFile.js';
    const result = isValidUrl(relativePath);
    expect(result).toBe(false);
  });
});
