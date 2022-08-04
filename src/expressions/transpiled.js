export class Transpiled {
    static type = "transpiledExpression";
    static TO_COMPILE_KEY = "@@";
    type = null;
    rawJs = "";
    toCompile = [];
    lineNumberStart = null;
    lineNumberEnd = null;
    isExpression = true;
    constructor(rawJs, toCompile, lineNumberStart, lineNumberEnd) {
        this.type = Transpiled.type;
        this.rawJs = rawJs;
        this.toCompile = toCompile;
        this.lineNumberStart = lineNumberStart;
        this.lineNumberEnd = lineNumberEnd;
    }
}