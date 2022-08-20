import { TokenTypes } from "./tokenTypes.js";
import { Collection } from "./expressions/collection.js";
import { Expression } from "./expressions/expression.js";
import { ImpureScope } from "./expressions/impureScope.js";
import { PureScope } from "./expressions/pureScope.js";
import { Transpiled } from "./expressions/transpiled.js";
import { TranspiledFunction } from "./expressions/transpiledFunction.js";
import { If } from "./functions/if.js";
import { For } from "./functions/for.js";

// containing methods for rebuilding a fcpl ast into javascript
export class Constructor {
    static constructAst(ast) {
        // recreates the raw js used to create an object
        function declareObject(obj, name, isFirstOfDeclarations, isLastOfDeclarations) {
            let output = isFirstOfDeclarations ? `const ${name} = {` : `, ${name} = {`;
            const keys = Object.keys(obj);
            for (const key in keys) {
                output += `${keys[key]}:${obj[keys[key]]}`;
                if (key < keys.length-1)
                    output += ",";
            }
            output += isLastOfDeclarations ? "};" : "}";
            return output;
        }
        // converts an element of the ast into a javascript
        function childToString(child) {
            let js = "";
            switch (child.type) {
                case Expression.type:
                    const functionId = childToString(child.functionId);
                    js = `${functionId}(`;
                    if (child.parameter.type === Collection.type) {
                        for (const item in child.parameter.items) {
                            js += `${childToString(child.parameter.items[item])}`;
                            if (child.parameter.items.length > Number(item)+1) {
                                js += ",";
                            }
                        }
                        js += ")";
                        break;
                    }
                    js += `${childToString(child.parameter)})`;
                    break;
                case Collection.type:
                    js = "[";
                    for (const item in child.items) {
                        js += `${childToString(child.items[item])}`;
                        if (child.items.length > Number(item)+1) {
                            js += ",";
                        }
                    }
                    js += "]";
                    break;
                case ImpureScope.type:
                    js += Constructor.constructAst(child);
                    break;
                case PureScope.type:
                    js += Constructor.constructAst(child);
                    break;
                case TranspiledFunction.type:
                    let fullyTranspiledFunction = child.resolve();
                    for (const toCompile of child.toCompile) {
                        fullyTranspiledFunction = fullyTranspiledFunction.replace(TranspiledFunction.TO_COMPILE_KEY, childToString(toCompile));
                    }
                    js+=fullyTranspiledFunction;
                    break;
                case Transpiled.type:
                    let fullyTranspiled = child.rawJs;
                    for (const toCompile of child.toCompile) {
                        fullyTranspiled = fullyTranspiled.replace(Transpiled.TO_COMPILE_KEY, childToString(toCompile));
                    }
                    js = fullyTranspiled;
                    break;
                case TokenTypes.ID_TYPE:
                    js = `${child.value}`;
                    break;
                case TokenTypes.LITERAL_TYPE:
                    js = `${child.value}`;
                    break;
                default:
                    console.log("hmmm this abstract syntax tree is weird! I don't know how to construct it into javascript...");
                    return;
            }
            return js;
        }
        const tree = ast.ast;
        let output = "";
        // add compile function result containers to the global scope
        if (ast.id === "global") output += `let ${If.IF_RESULT_NAME} = null; let ${For.LOOP_RESULT_NAME} = null;`;
        // output = declareObject(ast.pureIds, "pureIds", true);
        // output += declareObject(ast.pureFunctions, "pureFunctions");
        // if (ast.type === PureScope.type) {
        //     output += ", impureIds = {}, impureFunctions = {};"
        // } else {
        //     output += declareObject(ast.impureIds, "impureIds");
        //     output += declareObject(ast.impureFunctions, "impureFunctions", false, ast.id != "global");
        // }
        // if (ast.id == "global") {
        //     output += declareObject(ast.importedPureIds, "importedPureIds");
        //     output += declareObject(ast.importedPureFunctions, "importedPureFunctions");
        //     output += declareObject(ast.importedImpureIds, "importedImpureIds");
        //     output += declareObject(ast.importedImpureFunctions, "importedImpureFunctions", false, true);
        // }
        while (tree.length > 0) {
            const child = tree.shift();
            output += childToString(child) + ";";
        }
        return output;
    }
}