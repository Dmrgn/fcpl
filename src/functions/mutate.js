import { TokenTypes } from "../tokenTypes.js";
import { Transpiled } from "../expressions/transpiled.js";
import { PureScope } from "../expressions/pureScope.js";

// expects arguments Mutate(id, literal or id);
export class Mutate {
    static resolve(self, scope) {
        const args = self.parameter.items ?? [self.parameter];
        const line = self.functionId.lineNumber;
        if (args.length != 2) console.log("hmmm... Mutate expected 2 arguments but got " + args.length + " instead on line " + line);
        if (args[0].type !== TokenTypes.ID_TYPE) console.log("hmmm... Mutate argument 1 to be of type Id but got type " + args[0].type + " instead on line " + line);
        if (scope.pureIds[args[0].value]) console.log("hmmm... you cant Mutate a pure Id on line" + line);
        if (scope.type === PureScope.type) console.log("hmmm... you cant use Mutate inside of a Pure Scope ... on line " + line);
        if (!scope?.impureIds?.[args[0].value])
            scope.impureIds[args[0].value] = null;
        let output = `${args[0].value} = ${Transpiled.TO_COMPILE_KEY}`;
        let toCompile = [args[1]];
        return new Transpiled(output, toCompile, line, line);
    }
}