import {Token} from "./token.js";

export class Pipe extends Token {
    static type = "pipe";
    subtype = null;
    constructor(lineNumber, subtype) {
        super(lineNumber, Pipe.type);
        this.subtype = subtype;
    }
}