import fs from 'fs';
import path from 'path';

// Verificar si la ruta !== null
export function routeVerification(path) {
  try {
    fs.accessSync(path);
    return true;
  } catch (err) {
    return false;
  }
}

// Convertir a ruta absoluta
export const convertToAbsoluteRoute = (filePath) => {
  if (path.isAbsolute(filePath)) {
    return filePath;
  } else {
    const absolutePath = (path.join(process.cwd(), filePath));
    return absolutePath;

  }
};

// Revisar si es un archivo //No es necesaria esta funcion
export function isAFile(pathUser) {
  const fileDetails = fs.statSync(pathUser);
  return fileDetails.isFile();
}

// Validar si es un archivo md
export const isFileMd = (filePath) => {
  return (path.extname(filePath) === ".md");
};

// Revisar si es una carpeta
export function isADirectory(pathUser) {
  const infoDir = fs.statSync(pathUser);
  return infoDir.isDirectory();
}

//Obtener los archivos md de la carpeta
export function getFilesFromDir(folderPath) {
  try {
    const fileNames = fs.readdirSync(folderPath);
    const filePaths = fileNames.map(fileName =>
      path.join(folderPath, fileName)
    );
    return filePaths;
  } catch (error) {
    console.error('Error al obtener los archivos:', error);
    return [];
  }
}

export function getMdFilesFromDir(folderPath) {
  try {
    const fileNames = fs.readdirSync(folderPath).filter(x => x.endsWith('.md'));
    const filePaths = fileNames.map(fileName =>
      convertToAbsoluteRoute(path.join(folderPath, fileName))
    );
    return filePaths;
  } catch (error) {
    console.error('Error al obtener los archivos:', error);
    return [];
  }
}

//¿Hay más carpetas dentro de path?
export function hasSubdirectories(directory) {
  return fs.readdirSync(directory).some(item => fs.lstatSync(`${directory}/${item}`).isDirectory());
}

export function getSubdirectories(directory) {
  const directories = fs.readdirSync(directory).filter(item => fs.lstatSync(`${directory}/${item}`).isDirectory());
  return directories.map(subDirectory => convertToAbsoluteRoute(path.join(directory, subDirectory)));
}

//Leer archivo (comprobar si tiene links)
export const readAFile = (filePath) => {
  let dataRes = null;
  fs.readFile(filePath, 'utf-8', (error, data) => {
    if (!error) {
      return data;
    }
  });
}

//obtener links
export const getLinks = (filePath) => new Promise((resolve, reject) => {
  const newLinksMd = [];

  fs.readFile(filePath, 'utf-8', (error, data) => {
    try{  
      if (error){
        reject(error);
      }
      
      const regex = /\[(.+?)\].*(https?:\/\/[^\s)]+)\)/g;
      let match = regex.exec(data);
      //si el archivo contiene Links debe retornar un array de links
      while (match != null) {
        newLinksMd.push({
          href: match[2], //almacena el valor de la segunda coincidencia capturada por la expresión regular. El segundo grupo capturado corresponde a la URL del enlace.
          text: match[1], //almacena el valor de la primera coincidencia capturada por la expresión regular. El primer grupo capturado corresponde al texto del enlace
          file: filePath, //almacena el valor del parámetro filePath que se pasó a la función getLinks. Representa la ruta del archivo en el que se encontró el enlace.
        });
        match = regex.exec(data);
      }
      resolve(newLinksMd);
    }catch(error){
      reject(error);
    }
  });
});

export const hasLinks = (filePath) => new Promise((resolve, reject) => {
  getLinks(filePath)
  .then(files => {
    if (files.length > 0){
      resolve(true);
    }else{
      resolve(false);
    }
  })
  .catch(error => {
    reject(error);
  })
});

export const processFilesRecursively = (routes, absolutePath) => { 
  console.log('absolutePath', absolutePath);
  routes.push(...getMdFilesFromDir(absolutePath))
  const subdirectories = getSubdirectories(absolutePath);
  subdirectories.forEach(directory => {
    processFilesRecursively(routes,directory);
  });
}
