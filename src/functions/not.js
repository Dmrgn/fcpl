import { Transpiled } from "../expressions/transpiled.js";

// expects arguments Not(anything);
export class Not {
    static resolve(self, scope) {
        const args = self.parameter.items ?? [self.parameter];
        const line = self.functionId.lineNumber;
        if (args.length != 1) console.log("hmmm... Not expected 1 argument but got " + args.length + " instead on line " + line);

        const toCompile = [args[0]];
        const output = `!(${Transpiled.TO_COMPILE_KEY})`;
        return new Transpiled(output, toCompile, line, line);
    }
}