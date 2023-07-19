import { routeVerification,
convertToAbsoluteRoute,
isFileMd,
isADirectory,
hasLinks,
processFilesRecursively
} from "./functions.js";



function mdlinks(path, options) {
  return new Promise((resolve, reject) => {
    const routes = [];
    const links = [];

    //verificar que la variable path no sea null
    if (path === null || path === undefined || path === '') {
      console.log('Error: no existe una ruta');
      reject('Error: no existe una ruta');
      return;
    }

    //verificar que la ruta existe
    const valid = routeVerification(path);
    if (!valid) {
      console.log('La ruta no existe');
      reject('La ruta no existe');
      return;
    }

    //verificar si ruta es absoluta, en caso de que no, transformar.
    const absolutePath = convertToAbsoluteRoute(path);
    console.log(`Ruta absoluta: ${absolutePath}`); //*borrar a futuro

    const isDirectoryResult = isADirectory(absolutePath);
    console.log(`¿Es un directorio?: ${isDirectoryResult}`); //*borrar a futuro

    if (isDirectoryResult) {
      processFilesRecursively(routes,absolutePath); 
    } else {
      // Si es un archivo...
      const isAFileMd = isFileMd(absolutePath);
      console.log(`¿Es un archivo .md?: ${isAFileMd}`);
      if (!isAFileMd) {
        console.log('No es un archivo md');
        reject('No es un archivo md');
        return;
      }

      routes.push(absolutePath);
    }

    // ¿Existen archivos .md por procesar?
    if (routes.length === 0){
      console.log('Error. No hay archivos .md');
      reject ('Error. No hay archivos .md');
    }

    // Procesar el próximo archivo del listado
    for (const currentMdFile of routes){
      // Add function to add all links to the array with the following code:

      console.log(currentMdFile)
      hasLinks(currentMdFile)
      .then(isThereALink => {
        console.log(`isThereALink in ${currentMdFile}?:`, isThereALink);
        if (!isThereALink){
          return; // Termina la ejecución del .then
        }

        console.log("si había links, continuar")
      })
    }

    resolve(routes);
  });
}


//mdlinks();
mdlinks('../md files')
.then(res => console.log(res))
.catch(error => console.log('error', error));

/*

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
  });*/