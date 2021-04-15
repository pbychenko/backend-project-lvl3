import axios from 'axios';
import fs from 'fs';
import path from 'path';
import isURL from 'validator/lib/isURL.js';

const formatUrl = (url) => url.split('://')[1].replace(/[^a-zA-ZА-Яа-я0-9]/g, '-');

export const isValidUrl = (url) => {
  if (url.includes('localhost')) {
    return true;
  }
  return isURL(url);
};

export const generateResourceFilesDirectoryName = (urlString) => {
  const resourceFilesDirectoryName = `${formatUrl(urlString)}_files`;
  return resourceFilesDirectoryName;
};

export const generateHtmlFileName = (urlString) => {
  const newPath = `${formatUrl(urlString)}.html`;
  return newPath;
};

export const generateResourceFileName = (urlString) => {
  const tempPath = urlString.split('://')[1];
  const { dir, name, ext } = path.parse(tempPath);
  const formattedPath = `${dir}/${name}`;
  const newPath = `${formattedPath.replace(/[^a-zA-ZА-Яа-я0-9]/g, '-')}${ext}`;

  return newPath;
};

export const editCanonicalPathInHtml = ($, resourceFilesDirectoryName, htmlFileName) => {
  const canonicalElement = $('head').find('link[rel="canonical"]');
  const link = canonicalElement.attr('href');

  if (link) {
    canonicalElement.attr('href', `${resourceFilesDirectoryName}/${htmlFileName}`);
  }
};

export const editResourcePathesInHtml = (selector, type, directoryName, $, url, resourceUrls) => {
  const map = {
    images: 'src',
    styles: 'href',
    scripts: 'src',
  };

  const attribute = map[type];
  const urlOrigin = (new URL(url)).origin;
  const links = $(selector);

  // eslint-disable-next-line func-names
  links.each(function () {
    const link = $(this).attr(attribute);
    if (link && (!isValidUrl(link) || ((new URL(link)).origin === urlOrigin))) {
      const { href } = new URL(link, urlOrigin);
      const fullResourceName = generateResourceFileName(href);

      resourceUrls[type].push(href);
      $(this).attr(attribute, path.join(directoryName, fullResourceName));
    }
  });
};

export const downLoadResource = (resourcePath, downLoadPath) => {
  const writer = fs.createWriteStream(downLoadPath);

  return axios({
    method: 'get',
    url: resourcePath,
    responseType: 'stream',
  }).then((response) => response.data.pipe(writer));
};

export const downloadResources = (links, resourceFilesDirectoryPath) => {
  const promises = links.map((link) => {
    const fullResourceName = generateResourceFileName(link);
    return downLoadResource(link, path.join(resourceFilesDirectoryPath, fullResourceName));
  });

  const promise = Promise.all(promises);
  return promise;
};
