import {Token} from "./token.js";

export class Literal extends Token {
    static type = "literal";
    subtype = null;
    value = null;
    isExpression = false;
    constructor(lineNumber, subtype, value) {
        super(lineNumber, Literal.type);
        this.subtype = subtype;
        this.value = value;
    }
}