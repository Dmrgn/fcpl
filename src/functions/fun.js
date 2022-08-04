import { TokenTypes } from "../tokenTypes.js";
import { Transpiled } from "../expressions/transpiled.js";
import { Collection } from "../expressions/collection.js";
import { PureScope } from "../expressions/pureScope.js";
import { ImpureScope } from "../expressions/impureScope.js";

// expects arguments Fun(id, (parameters), pure/impure scope);
export class Fun {
    static resolve(self, scope) {
        const args = self.parameter.items ?? [self.parameter];
        const line = self.functionId.lineNumber;
        if (args.length != 3) console.log("hmmm... Fun expected 3 arguments but got " + args.length + " instead on line " + line);
        if (args[0].type !== TokenTypes.ID_TYPE) console.log("hmmm... expected Fun argument 1 to be of type Id but got type " + args[0].type + " instead on line " + line);
        if (args[1].type !== Collection.type) console.log("hmmm... expected Fun argument 2 to be of type Collection but got type " + args[0].type + " instead on line " + line);
        if (args[2].type !== PureScope.type && args[2].type !== ImpureScope.type) console.log("hmmm... expected Fun argument 3 to be of type Scope but got type " + args[0].type + " instead on line " + line);
        // if its a pure scope
        let purity = (args[2].type === PureScope.type) ? "pure" : "impure";
        if (scope.type === PureScope.type && purity === "impure") 
            console.log("hmmm... you cant declare an impure function inside of a Pure Scope ... on line " + line);
        let formatedArgs = "";
        for (let i = 0; i < args[1].items.length; i++) {
            // all the arguments are empty ids so we can use value
            // instead of constructing them
            const argument = args[1].items[i];
            args[2][`${purity}Ids`][argument.value] = argument.value;
            formatedArgs += argument.value;
            if (i < args[1].items.length - 1) formatedArgs += ",";
        }
        // add this function to the scopes list of functions
        scope[`${purity}Functions`][args[0].value] = true;
        // create final output
        let output = `pureFunctions["${args[0].value}"] = function(${formatedArgs}){${Transpiled.TO_COMPILE_KEY}}`;
        args[2].unWrapOnCompile = true;
        let toCompile = [args[2]];
        return new Transpiled(output, toCompile, line, line);
    }
}