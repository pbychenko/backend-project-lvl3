import { generateResourceFileName } from '../src/utils.js';

describe('Check resource files name generation', () => {
  test('check resource url ended on .png', async () => {
    const pngImgUrl = 'https://testurl.com/public/pictures/logo.png';
    const result = generateResourceFileName(pngImgUrl);

    expect(result).toBe('testurl-com-public-pictures-logo.png');
  });

  test('check url ended on .jpg', async () => {
    const jpgImgUrl = 'https://testurl.com/public/pictures/logo.jpg';
    const result = generateResourceFileName(jpgImgUrl);

    expect(result).toBe('testurl-com-public-pictures-logo.jpg');
  });

  test('check url ended on .css', async () => {
    const cssUrl = 'https://testurl.com/public/styles.css';
    const result = generateResourceFileName(cssUrl);

    expect(result).toBe('testurl-com-public-styles.css');
  });

  test('check url ended on .js', async () => {
    const jsUrl = 'https://testurl.com/public/script.js';
    const result = generateResourceFileName(jsUrl);

    expect(result).toBe('testurl-com-public-script.js');
  });
});
