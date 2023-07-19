import chalk from "chalk";
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
      console.log(chalk.bgRed.bold('Error: There is no route'));
      reject('Error: There is no route');
      return;
    }

    //verificar que la ruta existe
    const valid = routeVerification(path);
    if (!valid) {
      console.log(chalk.red('Error: Path does not exist'));
      reject('Error: Path does not exist');
      return;
    }

    //verificar si ruta es absoluta, en caso de que no, transformar.
    const absolutePath = convertToAbsoluteRoute(path);
    console.log(`Absolute route: ${absolutePath}`); //*borrar a futuro

    const isDirectoryResult = isADirectory(absolutePath);
    console.log(chalk.blue.underline.bold(`¿Is a directory?: ${isDirectoryResult}`)); //*borrar a futuro

    if (isDirectoryResult) {
      processFilesRecursively(routes,absolutePath); 
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

    // ¿Existen archivos .md por procesar?
    if (routes.length === 0){
      console.log('"Error: There are no .md files');
      reject ('"Error: There are no .md files');
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

