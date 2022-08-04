import { Collection } from "../expressions/collection.js";
import { Transpiled } from "../expressions/transpiled.js";
import { Id } from "../tokens/id.js";
import { TokenTypes } from "../tokenTypes.js";

// expects arguments Index(id, number literal);
export class Index {
    static resolve(self, scope) {
        const args = self.parameter.items ?? [self.parameter];
        const line = self.functionId.lineNumber;
        if (args.length !== 2) console.log("hmmm... Index expected 2 arguments but got " + args.length + " instead on line " + line);
        if (args[0].type !== Id.type && args[0].type !== TokenTypes.LITERAL_TYPE && args[0].type !== Collection.type) 
            console.log("hmmm... Index expected argument 1 to be of type Id or Literal or Collection but got " + args[0].type + " instead on line " + line);
        
        // idValue[index]
        let idValue = ""; 
        let toCompile = [];
        if (args[0].type === Id.type) {
            const idType = scope.findId(args[0].value);
            if (!idType)
                console.log("hmmm... Index recieved " + args[0].value + " as argument 1 ... but it isnt declared anywhere visible! on line " + line);
            else if (idType === Id.PURE_ID_TYPE)
                idValue = `pureIds["${args[0].value}"]`;
            else if (idType === Id.IMPURE_ID_TYPE)
                idValue = `impureIds["${args[0].value}"]`;
            else
                console.log("hmmm... Index expected argument 1 to be of type Id but got a Scope instead... on line " + line);
        } else {
            idValue = Transpiled.TO_COMPILE_KEY;
            toCompile.push(args[0]);
        }
        toCompile.push(args[1]);
        let output = `${idValue}[${Transpiled.TO_COMPILE_KEY}]`;
        return new Transpiled(output, toCompile, line, line);
    }
}