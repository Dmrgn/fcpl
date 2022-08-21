import { Transpiled } from "../expressions/transpiled.js";
import { Expression } from "../expressions/expression.js";
import { TokenTypes } from "../tokenTypes.js";
import { PureScope } from "../expressions/pureScope.js";
import { ImpureScope } from "../expressions/impureScope.js";
import { Fun } from "./fun.js";

// expects arguments If(any expression, scope, scope);
export class If {
    static IF_RESULT_NAME = "__if_result_"
    static resolve(self, scope) {
        const args = self.parameter.items ?? [self.parameter];
        const line = self.functionId.lineNumber;
        if (args.length < 2 || args.length > 3) console.log("hmmm... If expected 2 or 3 arguments but got " + args.length + " instead on line " + line);
        if (args[0].type !== Expression.type && args[0].type !== TokenTypes.ID_TYPE && args[0].type !== TokenTypes.LITERAL_TYPE)
            console.log("hmmm... If expected argument 1 to be of type Expression, Id or Literal, but got " + args[0].type + " instead on line " + line);
        if (args[1].type !== PureScope.type && args[1].type !== ImpureScope.type)
            console.log("hmmm... If expected argument 2 to be of type scope but got " + args[1].type + " instead on line " + line);
        let isElse = false;
        if (args.length == 3) {
            if (args[2].type !== PureScope.type && args[2].type !== ImpureScope.type)
                console.log("hmmm... If expected argument 3 to be of type scope but got " + args[2].type + " instead on line " + line);
            isElse = true;
        }

        let toCompile = [args[0], args[1]];
        let output = `${If.IF_RESULT_NAME} = function() {`
        output += `if (${Transpiled.TO_COMPILE_KEY}) { ${Transpiled.TO_COMPILE_KEY} return true; }`;
        if (isElse) {
            args[2].parentScope = scope;
            toCompile.push(args[2]);
            output += ` else { ${Transpiled.TO_COMPILE_KEY} return false; }`;
        }
        output += `}()`
        return new Transpiled(output, toCompile, line, line);
    }
}