import * as rl from "readline-sync";
import { readFileSync, writeFileSync } from "fs";
import * as path from "path";
import {fileURLToPath} from 'url';
import {minify} from 'minify';
import tryToCatch from 'try-to-catch';

import { Lexer } from "./lexer.js";
import { Parser } from "./parser.js";
import { Refiner } from "./refiner.js";
import { Constructor } from "./constructor.js";
import { SPLASH_TITLES } from "./splashes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const VERSION = "0.3.0";

/** Written by Daniel Morgan
 ________  ________  ________   ___  _______   ___               _____ ______   ________  ________  ________  ________  ________      
|\   ___ \|\   __  \|\   ___  \|\  \|\  ___ \ |\  \             |\   _ \  _   \|\   __  \|\   __  \|\   ____\|\   __  \|\   ___  \    
\ \  \_|\ \ \  \|\  \ \  \\ \  \ \  \ \   __/|\ \  \            \ \  \\\__\ \  \ \  \|\  \ \  \|\  \ \  \___|\ \  \|\  \ \  \\ \  \   
 \ \  \ \\ \ \   __  \ \  \\ \  \ \  \ \  \_|/_\ \  \            \ \  \\|__| \  \ \  \\\  \ \   _  _\ \  \  __\ \   __  \ \  \\ \  \  
  \ \  \_\\ \ \  \ \  \ \  \\ \  \ \  \ \  \_|\ \ \  \____        \ \  \    \ \  \ \  \\\  \ \  \\  \\ \  \|\  \ \  \ \  \ \  \\ \  \ 
   \ \_______\ \__\ \__\ \__\\ \__\ \__\ \_______\ \_______\       \ \__\    \ \__\ \_______\ \__\\ _\\ \_______\ \__\ \__\ \__\\ \__\
    \|_______|\|__|\|__|\|__| \|__|\|__|\|_______|\|_______|        \|__|     \|__|\|_______|\|__|\|__|\|_______|\|__|\|__|\|__| \|__|

**/

async function transpile(input, outputDir) {
    // tokenize raw text into understandable parts
    const tokenized = Lexer.tokenize(input);
    // console.log("Tokens: ", tokenized);

    // turn tokens into an abstract syntax tree
    const ast = Parser.createAst(tokenized);
    // console.log("Ast: ", ast);
    // writeFileSync(outputDir ? path.join(outputDir, "/ast.json") : path.join(__dirname, "../output/ast.json"), JSON.stringify(ast));

    // refine the created abstract syntax tree
    const refined = Refiner.refineAst(ast);
    // console.log("Refined: ", refined);
    // writeFileSync(outputDir ? path.join(outputDir, "/refined.json") : path.join(__dirname, "../output/refined.json"), JSON.stringify(refined));

    // rebuilt abstract syntax tree in javascript
    const constructed = Constructor.constructAst(refined);
    // console.log("Constructed: ", constructed);

    const finalOutputDir = outputDir ? path.join(outputDir, "/output.js") : path.join(__dirname, "../output/output.js");
    
    writeFileSync(finalOutputDir, constructed);
    const minify_options = {
        js: {
            mangle: false,
            compress: false,
            parse: {}
        }
    };
    writeFileSync(finalOutputDir, await minify(finalOutputDir, minify_options) + `\n// Transplied from fcpl. Version: ${VERSION}`);
    
    return constructed;
}

// check if file was passed as an argument
if (process.argv[2]) {
    const input = readFileSync(path.resolve(process.argv[2]), "utf8");
    const output = (process.argv[3] === "-o") ? process.argv[4] : null;
    await transpile(input, output);
    process.exit(0);
}

// start cli
console.log(SPLASH_TITLES[Math.floor(Math.random()*SPLASH_TITLES.length)]);
console.log("fcpl version: " + VERSION);
console.log("created by Daniel Morgan");

while (true) {
    const input = rl.question("fcpl>");
    console.log(eval(await transpile(input)));
}