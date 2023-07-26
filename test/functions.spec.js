import { routeVerification,
convertToAbsoluteRoute,
isFileMd,
isADirectory,
getMdFilesFromDir,
hasSubdirectories,
getSubdirectories,
processFilesRecursively,
getMDFileRoutes,
 } from '../src/functions'
import path from 'path';
import fs from 'fs'

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
  const testFolderPath = path.resolve('./test-folder'); // Carpeta de prueba
  const nonExistentFolderPath = path.resolve('./nonexistent-folder'); // Carpeta que no existe

  beforeAll(() => {
    // Creamos la carpeta de prueba antes de todas las pruebas
    fs.mkdirSync(testFolderPath, { recursive: true });
  });

  afterAll(() => {
    // Eliminamos la carpeta de prueba después de todas las pruebas
    fs.rmdirSync(testFolderPath, { recursive: true });
  });

  it('should return true when the path points to a directory', () => {
    // Act
    const result = isADirectory(testFolderPath);

    // Assert
    expect(result).toBe(true);
  });

  it('should return false when the path points to a file', () => {
    // Arrange
    const filePath = path.join(testFolderPath, 'test-file.txt');
    fs.writeFileSync(filePath, 'This is a test file.');

    // Act
    const result = isADirectory(filePath);

    // Assert
    expect(result).toBe(false);
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

describe('hasSubdirectories', () => {
  it('should return true when the directory contains subdirectories', () => {
    // Arrange
    const directoryPath = './test-folder';
    const subdirectoryName = 'subdir';

    // Create a temporary folder and a subdirectory inside it for the test
    fs.mkdirSync(directoryPath);
    fs.mkdirSync(`${directoryPath}/${subdirectoryName}`);

    // Act
    const result = hasSubdirectories(directoryPath);

    // Assert
    expect(result).toBe(true);

    // Cleanup
    fs.rmdirSync(`${directoryPath}/${subdirectoryName}`);
    fs.rmdirSync(directoryPath);
  });

  it('should return false when the directory does not contain subdirectories', () => {
    // Arrange
    const directoryPath = './test-folder';

    // Create a temporary folder for the test
    fs.mkdirSync(directoryPath);

    // Act
    const result = hasSubdirectories(directoryPath);

    // Assert
    expect(result).toBe(false);

    // Cleanup
    fs.rmdirSync(directoryPath);
  });

});

describe('getSubdirectories', () => {
  beforeEach(() => {
    // Creamos una carpeta temporal antes de cada prueba
    fs.mkdirSync('./test-folder');
  });

  afterEach(() => {
    // Eliminamos la carpeta temporal después de cada prueba
    fs.rmdirSync('./test-folder', { recursive: true });
  });

  it('should return an array of absolute paths to subdirectories when given a valid directory path', () => {
    // Arrange
    const directoryPath = './test-folder';
    const subdirectoryNames = ['subdir1', 'subdir2', 'subdir3'];

    // Creamos los subdirectorios dentro de la carpeta temporal para la prueba
    subdirectoryNames.forEach(subdirName => fs.mkdirSync(`${directoryPath}/${subdirName}`));

    // Act
    const result = getSubdirectories(directoryPath);

    // Assert
    const expectedPaths = subdirectoryNames.map(subdir => convertToAbsoluteRoute(`${directoryPath}/${subdir}`));
    expect(result).toEqual(expectedPaths);
  });

  it('should return an empty array when given a directory with no subdirectories', () => {
    // Arrange
    const directoryPath = './test-folder';

    // Act
    const result = getSubdirectories(directoryPath);

    // Assert
    expect(result).toEqual([]);
  });

});

describe('processFilesRecursively', () => {
  // Directorio temporal para las pruebas
  let tempDir;
  let tempDirUnique;

  // Creamos el directorio temporal una vez antes de todas las pruebas
  beforeAll(() => {
    tempDir = path.resolve('./temp-dir');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
  });

  beforeEach(() => {
    // Creamos un directorio temporal único para cada prueba usando un identificador único
    tempDirUnique = path.resolve(`./temp-dir-${Date.now()}`);
    fs.mkdirSync(tempDirUnique);
  });

  afterEach(() => {
    // Eliminamos el directorio temporal después de cada prueba
    fs.rmdirSync(tempDirUnique, { recursive: true });
  });

  afterAll(() => {
    // Eliminamos el directorio temporal creado antes de todas las pruebas
    fs.rmdirSync(tempDir, { recursive: true });
  });

  it('should process files and subdirectories recursively', () => {
    // Creamos una estructura de directorios de prueba
    const root = {
      name: 'root',
      files: ['file1.md', 'file2.md'],
      subdirectories: [
        {
          name: 'subdir1',
          files: ['file3.md'],
          subdirectories: [],
        },
        {
          name: 'subdir2',
          files: ['file4.md'],
          subdirectories: [],
        },
      ],
    };

    // Función auxiliar para crear la estructura de directorios en un objeto
    function createDirectory(directory, parentPath = '') {
      const { name, files, subdirectories } = directory;
      const directoryPath = path.join(tempDirUnique, parentPath, name);
      // Creamos el directorio actual
      fs.mkdirSync(directoryPath);

      // Agregar los archivos del directorio actual
      files.forEach((file) => {
        fs.writeFileSync(path.join(directoryPath, file), '');
      });

      // Llamar recursivamente para crear subdirectorios
      subdirectories.forEach((subdir) => {
        createDirectory(subdir, path.join(parentPath, name));
      });
    }

    // Crear la estructura de directorios de prueba
    createDirectory(root);

    // Ruta absoluta del directorio raíz
    const absoluteRoot = path.join(tempDirUnique, 'root');

    // Definir un arreglo para almacenar las rutas de los archivos encontrados
    const routes = [];

    // Act
    processFilesRecursively(routes, absoluteRoot);

    // Assert
    expect(routes).toEqual([
      path.join(tempDirUnique, 'root/file1.md'),
      path.join(tempDirUnique, 'root/file2.md'),
      path.join(tempDirUnique, 'root/subdir1/file3.md'),
      path.join(tempDirUnique, 'root/subdir2/file4.md'),
    ]);
  });


  it('should handle empty directory', () => {
    // Definir un arreglo para almacenar las rutas de los archivos encontrados
    const routes = [];
    // Directorio vacío
    const emptyDir = path.join(tempDir, 'empty-dir');
    fs.mkdirSync(emptyDir);

    // Act
    processFilesRecursively(routes, emptyDir);

    // Assert
    expect(routes).toEqual([]);
  });
});



describe('getMDFileRoutes', () => {
  // Directorio temporal para las pruebas
  let tempDir;

  // Creamos el directorio temporal una vez antes de todas las pruebas
  beforeAll(() => {
    tempDir = path.resolve('./temp-dir');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
  });

  beforeEach(() => {
    // Limpiamos el directorio temporal antes de cada prueba
    fs.rmdirSync(tempDir, { recursive: true });
    fs.mkdirSync(tempDir);
  });

  afterAll(() => {
    // Eliminamos el directorio temporal después de todas las pruebas
    fs.rmdirSync(tempDir, { recursive: true });
  });
  
  it('should add all .md file routes in the directory and its subdirectories to the routes array', () => {
    // Creamos una estructura de directorios de prueba
    const root = {
      name: 'root',
      files: ['file1.md', 'file2.md'],
      subdirectories: [
        {
          name: 'subdir1',
          files: ['file3.md'],
          subdirectories: [],
        },
        {
          name: 'subdir2',
          files: ['file4.md'],
          subdirectories: [],
        },
      ],
    };

    // Función auxiliar para crear la estructura de directorios en un objeto
    function createDirectory(directory, parentPath = '') {
      const { name, files, subdirectories } = directory;
      const directoryPath = path.join(tempDir, parentPath, name);
      // Creamos el directorio actual
      fs.mkdirSync(directoryPath);

      // Agregar los archivos del directorio actual
      files.forEach((file) => {
        fs.writeFileSync(path.join(directoryPath, file), '');
      });

      // Llamar recursivamente para crear subdirectorios
      subdirectories.forEach((subdir) => {
        createDirectory(subdir, path.join(parentPath, name));
      });
    }

    // Crear la estructura de directorios de prueba
    createDirectory(root);

    // Ruta absoluta del directorio raíz
    const absoluteRoot = path.join(tempDir, 'root');

    // Definir un arreglo para almacenar las rutas de los archivos encontrados
    const routes = [];

    // Act
    getMDFileRoutes(absoluteRoot, routes);

    // Assert
    expect(routes).toEqual([
      path.join(tempDir, 'root/file1.md'),
      path.join(tempDir, 'root/file2.md'),
      path.join(tempDir, 'root/subdir1/file3.md'),
      path.join(tempDir, 'root/subdir2/file4.md'),
    ]);
  });

  it('should add the .md file route to the routes array', () => {
    // Ruta absoluta del archivo .md
    const absoluteFilePath = path.join(tempDir, 'test.md');

    // Creamos el archivo .md
    fs.writeFileSync(absoluteFilePath, '');

    // Definir un arreglo para almacenar las rutas de los archivos encontrados
    const routes = [];

    // Act
    getMDFileRoutes(absoluteFilePath, routes);

    // Assert
    expect(routes).toEqual([absoluteFilePath]);
  });

  it('should handle invalid or non-existent path', () => {
    // Ruta que no existe
    const nonExistentPath = path.join(tempDir, 'nonexistent');
  
    // Verificamos si la carpeta no existe y la creamos
    if (!fs.existsSync(nonExistentPath)) {
      fs.mkdirSync(nonExistentPath);
    }
  
    // Definir un arreglo para almacenar las rutas de los archivos encontrados
    const routes = [];
  
    // Act
    getMDFileRoutes(nonExistentPath, routes);
  
    // Assert
    expect(routes).toEqual([]);
  });
});

