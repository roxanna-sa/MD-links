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
  } else {
    return path.resolve(filePath)

  }
};

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
/*export function getFilesFromDir(folderPath) {
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
}*/

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

//obtener links
export const getLinks = (filePath) => new Promise((resolve, reject) => {
  const newLinksMd = [];

  fs.readFile(filePath, 'utf-8', (error, data) => {
    try {
      if (error) {
        reject(error);
      }

      const regex = /\[(.+?)\].*(https?:\/\/[^\s)]+)\)/g;
      let match = regex.exec(data);
      //si el archivo contiene Links debe retornar un array de links
      while (match != null) {
        newLinksMd.push({
          href: match[2].replace(/"/g, ""), //almacena el valor de la segunda coincidencia capturada por la expresión regular. El segundo grupo capturado corresponde a la URL del enlace.
          text: match[1], //almacena el valor de la primera coincidencia capturada por la expresión regular. El primer grupo capturado corresponde al texto del enlace
          file: filePath, //almacena el valor del parámetro filePath que se pasó a la función getLinks. Representa la ruta del archivo en el que se encontró el enlace.
        });
        match = regex.exec(data);
      }
      resolve(newLinksMd);
    } catch (error) {
      reject(error);
    }
  });
});

/**
 * 
 * @param {*} routes - arreglo donde guardaremos las rutas (se pasa como referencia)
 * @param {*} absolutePath - donde estamos procesando
 */
export const processFilesRecursively = (routes, absolutePath) => {
  console.log('absolutePath', absolutePath);
  routes.push(...getMdFilesFromDir(absolutePath))
  const subdirectories = getSubdirectories(absolutePath);
  subdirectories.forEach(directory => {
    processFilesRecursively(routes, directory);
  });
}

export const getMDFileRoutes = (path, routes) => {
  //verificar si ruta es absoluta, en caso de que no, transformar.
  const absolutePath = convertToAbsoluteRoute(path);
  console.log(`Absolute route: ${absolutePath}`); //*borrar a futuro

  const isDirectoryResult = isADirectory(absolutePath);
  console.log((`¿Is a directory?: ${isDirectoryResult}`)); //*borrar a futuro

  if (isDirectoryResult) {
    processFilesRecursively(routes, absolutePath);
  } else {
    // Si es un archivo...
    const isAFileMd = isFileMd(absolutePath);
    console.log(`¿Is it a .md?: ${isAFileMd}`);
    if (!isAFileMd) {
      console.log('It is not a .md file');
      reject('It is not a .md file');
      return;
    }

    routes.push(absolutePath);
  }
}

// Obtener los enlaces en un archivo MD
export const getLinksInFile = (currentMdFile) => {
  return getLinks(currentMdFile)
    .catch(error => {
      console.error('Error processing links in file:', error);
      return [];
    });
};

export const validate = (link) => axios.get(link.href)
  .then(response => ({
    href: link.href,
    text: link.text,
    file: link.file,
    status: response.status,
    ok: response.status >= 200 && response.status < 400 ? 'ok' : 'fail'
  }))
  .catch(error => ({
    href: link.href,
    text: link.text,
    file: link.file,
    status: error.response ? error.response.status : null,
    ok: 'fail'
  }));

// Realizar la validación para un array de enlaces
export const validateLinks = (links) => {
  const linkValidations = links.map(link => validate(link));
  return Promise.all(linkValidations)
    .then(validations => {
      validations.forEach((validation, index) => {
        console.log(`href: ${validation.href}`);
        console.log(`text: ${validation.text}`);
        console.log(`file: ${validation.file}`);
        console.log(`status: ${validation.status}`);
        console.log(`ok: ${validation.ok}`);
        console.log('--------------------------');

        // Agregar validaciones a link que es lo que se devuelve al usuario que usó finalmente:
        links[index]["status"] = validation.status;
        links[index]["ok"] = validation.ok;
      });
      return links;
    })
    .catch(error => {
      console.error('Error during link validation:', error);
      return links;
    });
};

// Obtener los links en los archivos MD y validarlos si es necesario
export const getLinksAndValidate = (routes, options) => {
  if (routes.length === 0) {
    console.log('"Error: There are no .md files');
    return Promise.reject('"Error: There are no .md files');
  }

  const linksPromises = routes.map(currentMdFile => getLinksInFile(currentMdFile));
  return Promise.all(linksPromises)
    .then(linksArray => linksArray.flat())
    .then(links => {
      if (options.validate) {
        return validateLinks(links);
      } else {
        links.forEach(link => {
          console.log(`href: ${link.href}\ntext: ${link.text}.\nfile: ${link.file}.\n`);
        });
        return links;
      }
    });
};

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
  return `${text.slice(0, 50)}...`;
}