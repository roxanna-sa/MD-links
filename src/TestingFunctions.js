import {
  routeVerification,
  convertToAbsoluteRoute,
  isFileMd,
  isADirectory,
  readAFile,
  getFilesFromDir,
  hasSubdirectories,
  getMdFilesFromDir,
  getSubdirectories,
  isAFile,
  getLinks,
  hasLinks,
  getLinksv2
} from "./functions.js";
import fs from 'fs';


// probando si funciona validar existencia de ruta, en index.js va la función mdlinks
const route = './functions.js';
const valid = routeVerification(route);
//const transformAbs = convertToAbsoluteRoute(route);

if (valid) {
  console.log('La ruta existe.');
} else {
  console.log('La ruta no existe.');
}

// probando si funciona convertir ruta relativa a absoluta
const relativePath = './functions.js';
const absolutePath = convertToAbsoluteRoute(relativePath);
console.log(`Ruta absoluta: ${absolutePath}`);

//probando si funciona revisar si es archivo
const filePath = './functions.js';
const isFileResult = isAFile(filePath);
console.log(`¿Es un archivo?: ${isFileResult}`);

// probando si funciona revisar archivo md
const fileCheck = '../README.md'
const isAFileMd = isFileMd(fileCheck)
console.log(`¿Es un archivo .md?: ${isAFileMd}`);
// probando si funciona es un directorio?
const dirPath = '../src';
const isDirectoryResult = isADirectory(dirPath);
console.log(`¿Es un directorio?: ${isDirectoryResult}`);

//probar si funciona read a file
const fileRoute = '../testing-links.md';

readAFile(fileRoute)
.then((data) => {
  console.log(`Contenido del archivo: ${data}`);
  })
.catch((error) => {
  console.error(`Error al leer el archivo: ${error}`);
});


// probando funcion getFilesFromDir
const folderPath = '../md files';

//const files = getFilesFromDir(folderPath);
//console.log(files);

// Probando si hay subdirectorios
if (hasSubdirectories(folderPath)) {
  console.log('Hay subdirectorios dentro del directorio.');
} else {
  console.log('No hay subdirectorios dentro del directorio.');
}

 console.log(getMdFilesFromDir(folderPath));
 console.log(getSubdirectories(folderPath));
 

 getLinks(`C:/Users/Roxana/Desktop/Laboratoria Proyects/MD-links/md files/testing-links.md`).then(links => {
  console.log("links", links);
 })

