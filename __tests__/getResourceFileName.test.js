import { getResourceFileName } from '../src/utils.js';

describe('Check resource files name generation', () => {
  test('check resource url ended on .png', async () => {
    const pngImgUrl = 'https://testurl.com/public/pictures/logo.png';
    // const result = getResourceFileName(pngImgUrl, 'png');
    const result = getResourceFileName(pngImgUrl);
    expect(result).toBe('testurl-com-public-pictures-logo.png');
  });

  test('check url ended on .jpg', async () => {
    const jpgImgUrl = 'https://testurl.com/public/pictures/logo.jpg';
    // const result = getResourceFileName(pngImgUrl, 'png');
    const result = getResourceFileName(jpgImgUrl);
    expect(result).toBe('testurl-com-public-pictures-logo.jpg');
  });

  test('check url ended on .css', async () => {
    const cssUrl = 'https://testurl.com/public/styles.css';
    // const result = getResourceFileName(cssUrl, 'css');
    const result = getResourceFileName(cssUrl);
    expect(result).toBe('testurl-com-public-styles.css');
  });
});
