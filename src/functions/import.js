import * as fs from 'fs';
import {fileURLToPath} from 'url';
import path from 'path';

import { Transpiled } from "../expressions/transpiled.js";
import { TokenTypes } from "../tokenTypes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// expects arguments Import(string literal);
export class Import {
    static STD_NAME = "std";
    static resolve(self, scope) {
        const args = self.parameter.items ?? [self.parameter];
        const line = self.functionId.lineNumber;
        if (args.length != 1) console.log("hmmm... Import expected 1 argument but got " + args.length + " instead on line " + line);
        if (args[0].type !== TokenTypes.LITERAL_TYPE || args[0].subtype !== TokenTypes.LITERAL_SUBTYPES.STRING)
            console.log("hmmm... Import expected a string literal as parameter 1 but got " + args[0].type + " " + (args[0].subtype ?? "") + " instead on line " + line);

        const passedPath = args[0].value.replaceAll("\"", "").split(".");
        if (passedPath.length > 2 || passedPath.length < 1) 
            console.log("hmmm... Import expected a string parameter in the form of 'libraryName.libraryElement' or 'libraryName' on line " + line + " but got " + args[0].value + " instead...");
        let libraryPath;
        let isDir = null;
        if (passedPath.length == 1) {
            // in the form of 'libraryName' and we need to import everything from the directory
            isDir = true;
            if (passedPath[0] == Import.STD_NAME) 
                libraryPath = path.resolve(__dirname, "../../libs/std")
            else
                libraryPath = path.resolve(`./${passedPath[0]}`)
        } else {
            // in the form 'libraryName.libraryElement' and we only need to import the libraryElement file
            isDir = false;
            if (passedPath[0] == Import.STD_NAME) 
                libraryPath = path.resolve(__dirname, `../../libs/std/${passedPath[1]}.js`)
            else
                libraryPath = path.resolve(`./${passedPath[0]}/${passedPath[1]}.js`)
        }
        if (fs.existsSync(libraryPath)) {
            if (isDir) { // we need to import every file from the specified directory
                const library = fs.readdirSync(libraryPath);
                let raw = "";
                fs.readdirSync(libraryPath).forEach(file => {
                    const fileData = eval(fs.readFileSync(path.resolve(libraryPath, file), "utf8"));
                    const fileResolution = fileData.resolve();
                    raw += `const ${file.split(".")[0]} = ${fileResolution};`;
                    scope.globalScope[`imported${fileData.type}`][fileData.name] = fileResolution;
                });
                // return new Transpiled(`/* imported ${args[0].value} */`, [], line, line);
                return new Transpiled(raw, [], line, line);
            }
            // we need to import only the specified file
            const library = eval(fs.readFileSync(libraryPath, "utf8"));
            const libraryResolution = library.resolve()
            let raw = `const ${passedPath[1]} = ${libraryResolution};`;
            scope.globalScope[`imported${library.type}`][library.name] = libraryResolution;

            // return new Transpiled(`/* imported ${args[0].value} */`, [], line, line);
            return new Transpiled(raw, [], line, line);
        }
        console.log("hmmm... on line " + line + " you tried to import something called " + args[0].value + " but that library doesn't exist anywhere visible!'");
    }
}