import { Transpiled } from "../expressions/transpiled.js";

// expects arguments LessThan(anything, anything);
export class LessThan {
    static resolve(self, scope) {
        const args = self.parameter.items ?? [self.parameter];
        const line = self.functionId.lineNumber;
        if (args.length != 2) console.log("hmmm... LessThan expected 2 arguments but got " + args.length + " instead on line " + line);

        const toCompile = [args[0], args[1]];
        const output = `(${Transpiled.TO_COMPILE_KEY} < ${Transpiled.TO_COMPILE_KEY})`;
        return new Transpiled(output, toCompile, line, line);
    }
}