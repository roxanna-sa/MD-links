"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mdlinks = mdlinks;
var _chalk = _interopRequireDefault(require("chalk"));
var _functions = require("./functions.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function mdlinks(path, options) {
  return new Promise((resolve, reject) => {
    const routes = [];
    /*const links = [];
    if (options == null){
      options = {
        validate: false,
        stats: false
      }
    }*/
    //verificar que la variable path no sea null
    if (path === null || path === undefined || path === '') {
      console.log(_chalk.default.bgRed.bold('Error: There is no route'));
      reject('Error: There is no route');
      return;
    }
    //verificar que la ruta existe
    const valid = (0, _functions.routeVerification)(path);
    if (!valid) {
      console.log(_chalk.default.red('Error: Path does not exist'));
      reject('Error: Path does not exist');
      return;
    }
    // Obtener todos los archivos md en la ruta y agregarlos a routes
    (0, _functions.getMDFileRoutes)(path, routes);
    (0, _functions.getLinksAndValidate)(routes, options).then(links => {
      (0, _functions.calculateStats)(links, options);
      resolve(links);
    }).catch(error => {
      console.log('Error during link processing:', error);
      reject(error);
    });
  });
}

/*const path = '../md files/';
const options = { 
  validate: true,
  stats: true
};
// Llamamos a mdlinks con la opción validate 
mdlinks(path, options)
  .then(message => console.log(message))
  .catch(error => console.log('Call status - ', error));*/