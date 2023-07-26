import { routeVerification,
getMDFileRoutes,
getLinksAndValidate
} from "./functions.js";


export function mdlinks(path, options) {
  return new Promise((resolve, reject) => {
    const routes = [];
    //verificar que la variable path no sea null
    if (path === null || path === undefined || path === '') {
      //console.log(chalk.bgRed.bold('Error: There is no route'));
      reject('Error: There is no route');
      return;
    }
    //verificar que la ruta existe
    const valid = routeVerification(path);
    if (!valid) {
      //console.log(chalk.red('Error: Path does not exist'));
      reject('Error: Path does not exist');
      return;
    }
    // Obtener todos los archivos md en la ruta y agregarlos a routes
    getMDFileRoutes(path, routes);

    getLinksAndValidate(routes, options)
      .then(links => {
        resolve(links);
      })
      .catch(error => {
        reject('Error during link processing:', error);
      });
  });
}





