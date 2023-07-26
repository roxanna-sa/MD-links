#!/usr/bin/env node
import figlet from "figlet";
import chalk from "chalk";
import { mdlinks } from "./index.js";
import { calculateStats } from "./functions.js";


// Función para mostrar el mensaje de MDlinks en ASCII art
const showBanner = () => {
  const bannerText = figlet.textSync("Md-Links", {
    font: "big",
    horizontalLayout: "default",
    verticalLayout: "default",
  });
  const bannerConColor = chalk.green.bold(bannerText);

  console.log(bannerConColor);
};

// Mostrar el mensaje de MDlinks al iniciar el CLI
showBanner();

// Obtener los argumentos pasados en la línea de comandos
const args = process.argv.slice(2);
const path = args[0];

const options = {
  validate: args.includes("--validate") || args.includes("-v"),
  stats: args.includes("--stats") || args.includes("-s"),
};

mdlinks(path, options)
  .then((links) => {
    // Imprimimos por pantalla el resultado del proceso
    links.forEach(validation => {
      console.log(`href: ${validation.href}`);
      console.log(`text: ${validation.text}`);
      console.log(`file: ${validation.file}`);
      if (options.validate){
        console.log(`status: ${validation.status}`);
        if(validation.ok === 'ok'){
          console.log(chalk.green.bold(`ok: ${validation.ok}`));
        }else{
          console.log(chalk.red.bold(`ok: ${validation.ok}`));
        }
      
      }
      console.log('--------------------------');
    });

    if(options.stats){
      calculateStats(links, options);
    }
  })
  .catch((error) => console.log(chalk.red(error)));