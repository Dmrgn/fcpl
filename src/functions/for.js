import { Collection } from "../expressions/collection.js";
import { ImpureScope } from "../expressions/impureScope.js";
import { PureScope } from "../expressions/pureScope.js";
import { Transpiled } from "../expressions/transpiled.js";
import { Id } from "../tokens/id.js";
import { TokenTypes } from "../tokenTypes.js";
import { Fun } from "./fun.js";

// expects arguments For(collection or number literal, collection or id, scope);
export class For {
    static LOOP_RESULT_NAME = "__loop_result_";
    static resolve(self, scope) {
        const args = self.parameter.items ?? [self.parameter];
        const line = self.functionId.lineNumber;
        if (args.length != 3) console.log("hmmm... For expected 3 arguments but got " + args.length + " instead on line " + line);
        if (args[0].type !== Collection.type && args[0].type !== TokenTypes.LITERAL_TYPE && args[0].type !== TokenTypes.ID_TYPE)
            console.log("hmmm... For expected argument 1 to be of type Collection or Literal or Id, but got " + args[0].type + " instead on line " + line);
        if (args[1].type !== Collection.type && args[1].type !== Id.type)
            console.log("hmmm... For expected argument 2 to be of Collection or Id, but got " + args[1].type + " instead on line " + line);
        if (args[2].type !== ImpureScope.type && args[2].type !== PureScope.type)
            console.log("hmmm... For expected argument 3 to be of type Impure or Pure Scope but got " + args[2].type + " instead on line " + line);

        // variable name for representing the current element and the index of the current element
        let elementId, indexId = null
        // create random names for the iterableId and the resultId
        let iterableId = "__iterableId_"+Math.floor(Math.random()*10000).toString(16),
            resultId = "__resultId_"+Math.floor(Math.random()*10000).toString(16);
        
        if (args[1].items?.length == 2) {
            // (elementId, indexId) is present as the second parameter
            elementId = args[1].items[0].value;
            indexId = args[1].items[1].value;
        } else if (args[1].items?.length == 1)
            // (elementId) is present as the second parameter
            elementId = args[1].items[0].value;
        else
            // elementId is present as the second parameter
            elementId = args[1].value
        
        // create entry for the index of the current element in the function scope
        // (the entry for the elementId is created later based on whether a collection
        // or a literal is passed as the first parameter)
        // but only if an index Id was specified (so we dont create overlap)
        if (!indexId) {
            // set a generic indexId if one was not specified
            args[2].pureIds[indexId] = `${indexId}`;
            indexId = "__index_id_";
        }

        // the function scope should gain access to the parent scope
        args[2].parentScope = scope;

        // Compile the collection or id and the function scope
        let toCompile = [args[0], args[2]];

        let output = `${For.LOOP_RESULT_NAME} = function() {const ${resultId} = [];`;
        
        // if we are working with a collection we want to use es6 enhanced for loop syntax
        if (args[0].type === Collection.type) {
            output += `const ${iterableId} = ${Transpiled.TO_COMPILE_KEY};`;
            output += `for (const ${indexId} in ${iterableId}) {`
            // create entry for the value of the current element in the function scope
            args[2].pureIds[elementId] = `${iterableId}[${indexId}]`;
            // output += `const ${elementId} = ${iterableId}[${indexId}];`;
        } else if (args[0].type === TokenTypes.LITERAL_TYPE) {
            // if we are working with a literal we want to use standard for loop syntax
            output += `for (let ${indexId} = 0; ${indexId} < ${Transpiled.TO_COMPILE_KEY}; ${indexId}++) {`
            // create entry for the value of the current element in the function scope 
            // (itll be identical to the indexId in this case because it was a literal
            // number passed)
            args[2].pureIds[elementId] = `${indexId}`;
            // output += `const ${elementId} = ${indexId};`;
        } else if (args[0].type === Id.type) {
            // if we are working with an Id then we want to use standard for loop syntax
            output += `const ${iterableId} = ${Transpiled.TO_COMPILE_KEY};`;
            output += `for (let ${indexId} = 0; ${indexId} < (`;
            output += `Array.isArray(${iterableId}) ? ${iterableId}.length : ${iterableId}`;
            output += `); ${indexId}++) {`;
            // create entry for the value of the current element in the function scope 
            args[2].pureIds[elementId] = `Array.isArray(${iterableId}) ? ${iterableId}[${indexId}] : ${indexId}`;
            // output += `const ${elementId} = Array.isArray(${iterableId}) ? ${iterableId}[${indexId}] : ${indexId};`;
        }
        // push each call to the created scope onto the result array
        output += `${resultId}.push(function() {${Transpiled.TO_COMPILE_KEY}}())}`;
        // return the result array
        output += `return ${resultId};}()`;
        return new Transpiled(output, toCompile, line, line);
    }
}