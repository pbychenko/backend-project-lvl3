export const getResourceFilesDirectoryName = (urlString) => {
  // const myUrl = new URL('https://test.com');
  // console.log(myUrl);
  // console.log(url.parse('http://stackoverflow.com/questions/17184791.html'));
  const filesDirectory = `${urlString.split('://')[1].replace(/[^a-zA-ZА-Яа-я0-9]/g, '-')}_files`;
  return filesDirectory;
};

export const getResourceFileName = (urlString, format) => {
  // const newPath = `${url.split('://')[1].replace(/\//g, '-')}.html`;
  const newPath = `${urlString.split('://')[1].replace(/[^a-zA-ZА-Яа-я0-9]/g, '-')}.${format}`;
  return newPath;
};
