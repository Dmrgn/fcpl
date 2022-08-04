import { Transpiled } from "../expressions/transpiled.js";

// expects arguments Return(any expression, literal, or id);
export class Return {
    static resolve(self, scope) {
        const args = self.parameter.items ?? [self.parameter];
        const line = self.functionId.lineNumber;
        if (args.length < 1) console.log("hmmm... Return expected at least 1 argument but got " + args.length + " instead on line " + line);

        let formatedArgs = "";
        let toCompile = [];
        for (let i = 0; i < args.length; i++) {
            toCompile.push(args[i]);
            formatedArgs += Transpiled.TO_COMPILE_KEY;
            if (i < args.length - 1)
                formatedArgs += ","; 
        }
        let output = `return ${formatedArgs}`;
        return new Transpiled(output, toCompile, line, line);
    }
}