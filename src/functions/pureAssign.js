import { TokenTypes } from "../tokenTypes.js";
import { Transpiled } from "../expressions/transpiled.js";

// expects arguments PureAssign(id, literal or id);
export class PureAssign {
    static resolve(self, scope) {
        const args = self.parameter.items ?? [self.parameter];
        const line = self.functionId.lineNumber;
        if (args.length != 2) console.log("hmmm... PureAssign expected 2 arguments but got " + args.length + " instead on line " + line);
        if (args[0].type !== TokenTypes.ID_TYPE) console.log("hmmm... PureAssign argument 1 to be of type Id but got type " + args[0].type + " instead on line " + line);
        if (scope.pureIds[args[0].value]) {
            console.log("Hmmm... you can't assign to a Pure Id which has already been assigned to on line " + line);
        }
        scope.pureIds[args[0].value] = true;
        let output = `${args[0].value} = ${Transpiled.TO_COMPILE_KEY}`;
        let toCompile = [args[1]];
        return new Transpiled(output, toCompile, line, line);
    }
}