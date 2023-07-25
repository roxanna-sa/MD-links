import { routeVerification,
convertToAbsoluteRoute,
isFileMd,
isADirectory,
getMdFilesFromDir } from '../src/functions.js'
import path from 'path';
import fs from 'fs';

test('La función routeVerification retorna true cuando la ruta existe', () => {
  const existingPath = './src';
  const result = routeVerification(existingPath);

  expect(result).toBe(true);
});

test('La función routeVerification retorna false cuando la ruta no existe', () => {
  const nonExistentPath = '../hello.js';
  const result = routeVerification(nonExistentPath);

  expect(result).toBe(false);
});

describe('convertToAbsoluteRoute', () => {
  test('should return the absolute path when given an absolute path', () => {

    const absolutePath =  path.resolve('C:\Users\Roxana\Desktop\Laboratoria Proyects\MD-links\md-files\test1');
    expect(convertToAbsoluteRoute(absolutePath)).toEqual(absolutePath);
  });

  test('should return the absolute path when given a relative path', () => {
    const relativePath = './src';
    const expectedAbsolutePath = path.resolve(relativePath);

    const result = convertToAbsoluteRoute(relativePath);
    expect(result).toBe(expectedAbsolutePath);
  });
});

describe('isFileMd', () => {
  it('should return true when the file has a .md extension', () => {
    const filePath = './md-files/test1/testing-links2.md';
    const result = isFileMd(filePath);

    expect(result).toBe(true);
  });

  it('should return false when the file does not have a .md extension', () => {
    const filePath = '../src/functions.js';
    const result = isFileMd(filePath);

    expect(result).toBe(false);
  });

  it('should return false when the file has a .md extension in uppercase', () => {
    const filePath = './md-files/test2/testing-links0.MD';
    const result = isFileMd(filePath);

    expect(result).toBe(false);
  });
});

describe('isADirectory', () => {
  it('should return true when the path points to a directory', () => {
    // Arrange
    const dirPath = './md-files';

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    // Act
    const result = isADirectory(dirPath);

    // Assert
    expect(result).toBe(true);
  });
  
  it('should return false when the path does not point to a directory', () => {

    const filePath = './md-files/test1/testing-links2.md';
    fs.writeFileSync(filePath, 'Hello, World!');

    const result = isADirectory(filePath);

    expect(result).toBe(false);

    fs.unlinkSync(filePath);
  });
});

describe('getMdFilesFromDir', () => {
  beforeEach(() => {
    // Create a temporary folder for each test
    if (!fs.existsSync('./test-folder')) {
      fs.mkdirSync('./test-folder');
    }
  });

  afterEach(() => {
    // Remove the temporary folder and files after each test
    fs.rmdirSync('./test-folder', { recursive: true });
  });

  it('should return an array of absolute file paths with .md extension when given a valid folder path', () => {
    const folderPath = './test-folder';
    const fileNames = ['file1.txt', 'file2.md', 'file3.js'];

    // Create test files inside the temporary folder and get the absolute file path of 'file2.md'
    fileNames.forEach(fileName => {
      fs.writeFileSync(path.join(folderPath, fileName), '');
    });

    const expectedFilePath = path.resolve(path.join(folderPath, 'file2.md'));
    const result = getMdFilesFromDir(folderPath);

    expect(result).toEqual([expectedFilePath]);
  });

  it('should return an empty array when given a folder path with no .md files', () => {
    const folderPath = './test-folder';
    const fileNames = ['file1.txt', 'file2.js'];

    // Create test files inside the temporary folder
    fileNames.forEach(fileName => {
      fs.writeFileSync(path.join(folderPath, fileName), '');
    });

    const result = getMdFilesFromDir(folderPath);

    expect(result).toEqual([]);
  });

  it('should return an empty array when given an invalid folder path', () => {
    const invalidFolderPath = './nonexistent-folder';

    const result = getMdFilesFromDir(invalidFolderPath);

    expect(result).toEqual([]);
  });
});
