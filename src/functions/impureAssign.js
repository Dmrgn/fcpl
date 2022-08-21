import { TokenTypes } from "../tokenTypes.js";
import { Transpiled } from "../expressions/transpiled.js";
import { PureScope } from "../expressions/pureScope.js";

// expects arguments ImpureAssign(id, literal or id);
export class ImpureAssign {
    static resolve(self, scope) {
        const args = self.parameter.items ?? [self.parameter];
        const line = self.functionId.lineNumber;
        if (args.length != 2) console.log("hmmm... ImpureAssign expected 2 arguments but got " + args.length + " instead on line " + line);
        if (args[0].type !== TokenTypes.ID_TYPE) console.log("hmmm... ImpureAssign argument 1 to be of type Id but got type " + args[0].type + " instead on line " + line);
        if (scope.pureIds[args[0].value]) console.log("hmmm... you cant ImpureAssign to an Id previously assigned to with PureAssign ... on line " + line);
        if (scope.type === PureScope.type) console.log("hmmm... you cant use ImpureAssign inside of a Pure Scope ... on line " + line);
        scope.impureIds[args[0].value] = true;
        let output = `${args[0].value} = ${Transpiled.TO_COMPILE_KEY}`;
        let toCompile = [args[1]];
        return new Transpiled(output, toCompile, line, line);
    }
}