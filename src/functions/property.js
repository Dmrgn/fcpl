import { Collection } from "../expressions/collection.js";
import { Transpiled } from "../expressions/transpiled.js";
import { Id } from "../tokens/id.js";
import { TokenTypes } from "../tokenTypes.js";

// expects arguments Property(id, string literal/id);
export class Property {
    static resolve(self, scope) {
        const args = self.parameter.items ?? [self.parameter];
        const line = self.functionId.lineNumber;
        if (args.length !== 2) console.log("hmmm... Property expected 2 arguments but got " + args.length + " instead on line " + line);
        if (args[0].type !== Id.type && args[0].type !== Collection.type) 
            console.log("hmmm... Property expected argument 1 to be of type Id or Collection but got " + args[0].type + " instead on line " + line);
        if (args[1].type !== Id.type && args[1].type !== TokenTypes.LITERAL_TYPE) 
            console.log("hmmm... Property expected argument 1 to be of type Id or Collection but got " + args[0].type + " instead on line " + line);
        // idValue["property"]
        let toCompile = [];
        toCompile.push(args[0]);
        toCompile.push(args[1]);
        let output = `${Transpiled.TO_COMPILE_KEY}`;
        if (args[1].type === Id.type) {
            output += `[${Transpiled.TO_COMPILE_KEY}]`;
        } else {
            output += `[${Transpiled.TO_COMPILE_KEY}]`;
        }
        return new Transpiled(output, toCompile, line, line);
    }
}