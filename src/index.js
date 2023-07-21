import chalk from "chalk";
import { routeVerification,
getMDFileRoutes,
getLinksAndValidate,
calculateStats
} from "./functions.js";

const path = '../md files/';
const options = { 
  validate: true,
  stats: true
};

function mdlinks(path, options) {
  return new Promise((resolve, reject) => {
    const routes = [];
    const links = [];
    if (options == null){
      options = {
        validate: false,
        stats: false
      }
    }
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
    // Obtener todos los archivos md en la ruta y agregarlos a routes
    getMDFileRoutes(path, routes);

    getLinksAndValidate(routes, options)
      .then(links => {

        calculateStats(links, options);

        resolve(links);
      })
      .catch(error => {
        console.log('Error during link processing:', error);
        reject(error);
      });
  });
}

  

// Obtener las rutas antes de llamar a mdlinks
const routes = [];

// Llamamos a mdlinks con la opción validate 
mdlinks(path, options)
  .then(message => console.log(message))
  .catch(error => console.log('error on call - ', error));

//mdlinks();
/*mdlinks('../md files/', { validate: true })
  .then(res => console.log("final sin log c:"))
  .catch(error => console.log('error on call - ', error));*/


