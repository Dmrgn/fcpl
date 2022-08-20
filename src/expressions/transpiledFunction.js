import { Transpiled } from "./transpiled.js";

export class TranspiledFunction extends Transpiled {
    static type = "transpiledFunctionExpression";
    static TO_COMPILE_KEY = "@||@";
    parameters = [];
    isCalled = false;
    constructor(rawJs, toCompile, parameterList, lineNumberStart, lineNumberEnd) {
        super(rawJs, toCompile, lineNumberStart, lineNumberEnd);
        this.type = TranspiledFunction.type;
        this.parameters = parameterList;
    }
    resolve() {
        let asString = "function (";
        let parameterList = "";
        for (const parameter in this.parameters) {
            parameterList += this.parameters[parameter];
            if (parameter < this.parameters.length - 1) {
                parameterList += ",";
            }
        }
        asString += parameterList;
        asString += ") {";
        asString += this.rawJs;
        asString += this.isCalled ? `}(${parameterList})` : "}";
        return asString;
    }
}