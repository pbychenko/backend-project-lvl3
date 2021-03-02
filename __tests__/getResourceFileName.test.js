import { getResourceFileName } from '../src/utils';

describe('Check resource files name generation', () => {
  test('check resource url ended on .png', async () => {
    const pngImgUrl = 'https://testurl.com/public/pictures/logo.png';
    const result = getResourceFileName(pngImgUrl, 'png');
    expect(result).toBe('testurl-com-public-pictures-logo.png');
  });

  test('check url ended on .jpg', async () => {
    const pngImgUrl = 'https://testurl.com/public/pictures/logo.jpg';
    const result = getResourceFileName(pngImgUrl, 'png');
    expect(result).toBe('testurl-com-public-pictures-logo.png');
  });
});
