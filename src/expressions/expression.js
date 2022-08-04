export class Expression {
    static type = "expressionExpression";
    type = null;
    functionId = null;
    parameter = null;
    lineNumberStart = null;
    lineNumberEnd = null;
    isExpression = true;
    constructor(functionId, parameter) {
        this.type = Expression.type;
        this.functionId = functionId;
        this.parameter = parameter;
        this.lineNumberStart = functionId.line;
        this.lineNumberEnd = parameter.line;
    }
}