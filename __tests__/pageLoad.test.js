// import fs from 'fs';
// import genDiff from '../src';

// const jsonFilepath1 = `${__dirname}/__fixtures__/json/before.json`;
// const jsonFilepath2 = `${__dirname}/__fixtures__/json/after.json`;
// const yamlFilepath1 = `${__dirname}/__fixtures__/yaml/before.yaml`;
// const yamlFilepath2 = `${__dirname}/__fixtures__/yaml/after.yaml`;
// const iniFilepath1 = `${__dirname}/__fixtures__/ini/before.ini`;
// const iniFilepath2 = `${__dirname}/__fixtures__/ini/after.ini`;

// describe('Check simple format', () => {
//   const expPath = `${__dirname}/__fixtures__/results/simpleRenderExpectedResult`;
//   const expected = fs.readFileSync(`${expPath}`, 'utf8');
//   test('Check json files', () => {
//     expect(genDiff(jsonFilepath1, jsonFilepath2, 'simple')).toBe(expected);
//   });

//   test('Check yaml files', () => {
//     expect(genDiff(yamlFilepath1, yamlFilepath2, 'simple')).toBe(expected);
//   });

//   test('Check ini files', () => {
//     expect(genDiff(iniFilepath1, iniFilepath2, 'simple')).toBe(expected);
//   });
// });

// describe('Check plain format', () => {
//   const expPath = `${__dirname}/__fixtures__/results/plainRenderExpectedResult`;
//   const expected = fs.readFileSync(`${expPath}`, 'utf8');
//   test('Check json files', () => {
//     expect(genDiff(jsonFilepath1, jsonFilepath2, 'plain')).toBe(expected);
//   });

//   test('Check yaml files', () => {
//     expect(genDiff(yamlFilepath1, yamlFilepath2, 'plain')).toBe(expected);
//   });

//   test('Check ini files', () => {
//     expect(genDiff(iniFilepath1, iniFilepath2, 'plain')).toBe(expected);
//   });
// });

// describe('Check json format', () => {
//   const expPath = `${__dirname}/__fixtures__/results/jsonRenderExpectedResult`;
//   const expected = fs.readFileSync(`${expPath}`, 'utf8');
//   test('Check json files', () => {
//     expect(genDiff(jsonFilepath1, jsonFilepath2, 'json')).toBe(expected);
//   });

//   test('Check yaml files', () => {
//     expect(genDiff(yamlFilepath1, yamlFilepath2, 'json')).toBe(expected);
//   });

//   test('Check ini files', () => {
//     expect(genDiff(iniFilepath1, iniFilepath2, 'json')).toBe(expected);
//   });
// });
