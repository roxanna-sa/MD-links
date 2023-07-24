#!/usr/bin/env node

import { mdlinks } from "./index.js";
import { calculateStats } from "./functions.js";
import figlet from "figlet";

// Función para mostrar el mensaje de MDlinks en ASCII art
const showBanner = () => {
  const bannerText = figlet.textSync("Md-Links", {
    font: "Doom",
    horizontalLayout: "default",
    verticalLayout: "default",
  });
  console.log(bannerText);
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
    links.forEach((link) => {
      const { href, text, file, status, ok } = link;
      if (options.stats && options.validate) {
        console.log(`${file} ${href} ${ok} ${status} ${text}`);
      } else if (options.stats) {
        console.log(`${file} ${href} ${text}`);
      } else if (options.validate) {
        console.log(`${file} ${href} ${ok} ${text}`);
      } else {
        console.log(`${file} ${href} ${text}`);
      }
    });
    if (options.stats) {
      calculateStats(links, options);
    }
  })
  .catch((error) => console.log('Error:', error));