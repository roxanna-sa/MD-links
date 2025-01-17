/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
import fs from 'fs';
import path from 'path';
import axios from 'axios';

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
  }
  return path.resolve(filePath);
};

// Validar si es un archivo md
export const isFileMd = (filePath) => (path.extname(filePath) === '.md');

// Revisar si es una carpeta
export function isADirectory(pathUser) {
  const infoDir = fs.statSync(pathUser);
  return infoDir.isDirectory();
}

export function getMdFilesFromDir(folderPath) {
  try {
    const fileNames = fs.readdirSync(folderPath).filter((x) => x.endsWith('.md'));
    const filePaths = fileNames.map((fileName) => convertToAbsoluteRoute(path.join(folderPath, fileName)));

    return filePaths;
  } catch (error) {
    console.error('Error al obtener los archivos:', error);
    return [];
  }
}

// ¿Hay más carpetas dentro de path?
export function hasSubdirectories(directory) {
  return fs.readdirSync(directory).some((item) => fs.lstatSync(`${directory}/${item}`).isDirectory());
}

export function getSubdirectories(directory) {
  const directories = fs.readdirSync(directory).filter((item) => fs.lstatSync(`${directory}/${item}`).isDirectory());
  return directories.map((subDirectory) => convertToAbsoluteRoute(path.join(directory, subDirectory)));
}

// Obtener links
export const getLinks = (filePath) => new Promise((resolve, reject) => {
  const newLinksMd = [];

  fs.readFile(filePath, 'utf-8', (error, data) => {
    try {
      if (error) {
        reject(error);
      }

      const regex = /\[(.+?)\].*(https?:\/\/[^\s)]+)\)/g;
      let match = regex.exec(data);
      // si el archivo contiene Links debe retornar un array de links
      while (match != null) {
        newLinksMd.push({
          href: match[2].replace(/"/g, ''), // almacena el valor de la segunda coincidencia capturada por la expresión regular. El segundo grupo capturado corresponde a la URL del enlace.
          text: match[1], // almacena el valor de la primera coincidencia capturada por la expresión regular. El primer grupo capturado corresponde al texto del enlace
          file: filePath, // almacena el valor del parámetro filePath que se pasó a la función getLinks. Representa la ruta del archivo en el que se encontró el enlace.
        });
        match = regex.exec(data);
      }
      resolve(newLinksMd);
    } catch (error) {
      reject(error);
    }
  });
});

// Procesar recursivamente
/**
 *
 * @param {*} routes - arreglo donde guardaremos las rutas (se pasa como referencia)
 * @param {*} absolutePath - donde estamos procesando
 */
export const processFilesRecursively = (routes, absolutePath) => {
  routes.push(...getMdFilesFromDir(absolutePath));
  const subdirectories = getSubdirectories(absolutePath);
  subdirectories.forEach((directory) => {
    processFilesRecursively(routes, directory);
  });
};

// Obtener las rutas de los archivos .md
export const getMDFileRoutes = (path, routes) => {
  // Verificar si ruta es absoluta, en caso de que no, transformar.
  const absolutePath = convertToAbsoluteRoute(path);
  const isDirectoryResult = isADirectory(absolutePath);

  if (isDirectoryResult) {
    processFilesRecursively(routes, absolutePath);
  } else {
    // Si es un archivo...
    const isAFileMd = isFileMd(absolutePath);
    if (!isAFileMd) {
      console.warn(`Warning: ${absolutePath} is not a .md file and will be skipped.`);
    } else {
      routes.push(absolutePath);
    }
  }
};

// Obtener los enlaces en un archivo MD
export const getLinksInFile = (currentMdFile) => getLinks(currentMdFile)
  .catch((error) => {
    console.error('Error al obtener links en el archivo:', error);
    return [];
  });

// validate
export const validate = (link) => axios.get(link.href)
  .then((response) => ({
    href: link.href,
    text: link.text,
    file: link.file,
    status: response.status,
    ok: response.status >= 200 && response.status < 400 ? 'ok' : 'fail',
  }))
  .catch((error) => ({
    href: link.href,
    text: link.text,
    file: link.file,
    status: error.response ? error.response.status : null,
    ok: 'fail',
  }));

// Realizar la validación para un array de enlaces
export const validateLinks = (links) => {
  const linkValidations = links.map((link) => validate(link));
  return Promise.all(linkValidations)
    .then((validations) => {
      validations.forEach((validation, index) => {
        // Agregar validaciones a link que es lo que se devuelve al usuario que usó finalmente:
        links[index].status = validation.status;
        links[index].ok = validation.ok;
      });
      return links;
    })
    .catch((error) => {
      console.error('Error during link validation:', error);
      return links;
    });
};

// Obtener los links en los archivos MD y validarlos si es necesario
export const getLinksAndValidate = (routes, options) => {
  if (routes.length === 0) {
    return Promise.reject(new Error('There are no .md files'));
  }

  const linksPromises = routes.map((currentMdFile) => getLinksInFile(currentMdFile));
  return Promise.all(linksPromises)
    .then((linksArray) => linksArray.flat())
    .then((links) => {
      if (options.validate) {
        return validateLinks(links);
      }
      return links;
    });
};

// Calcular los stats
export const calculateStats = (links, options) => {
  if (!options.stats) {
    return;
  }

  const uniqueLinksSet = new Set(links.map((link) => link.href));
  const uniqueLinks = [...uniqueLinksSet];

  console.log(`Total: ${links.length}`);
  console.log(`Unique: ${uniqueLinks.length}`);

  if (options.validate) {
    const brokenLinks = links.filter((link) => link.ok === 'fail');
    const uniqueBrokenLinksSet = new Set(brokenLinks.map((link) => link.href));
    const uniqueBrokenLinks = [...uniqueBrokenLinksSet];
    console.log(`Broken: ${uniqueBrokenLinks.length}`);
  }
};

// Truncar el largo a 50 char
export function truncateText(text) {
  if (text.length <= 50) {
    return text;
  }

  const truncatedText = text.slice(0, 50);
  if (truncatedText.endsWith('...')) {
    return truncatedText.slice(0, -3);
  }

  return `${truncatedText}...`;
}
