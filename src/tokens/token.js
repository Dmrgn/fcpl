export class Token {
    type = null
    lineNumber = null;
    constructor(lineNumber, type) {
        this.lineNumber = lineNumber;
        this.type = type;
    }
}