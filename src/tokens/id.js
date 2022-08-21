import { ImpureScope } from "../expressions/impureScope.js";
import { PureScope } from "../expressions/pureScope.js";
import { Transpiled } from "../expressions/transpiled.js";
import {Token} from "./token.js";

export class Id extends Token {
    static type = "id";
    static IMPURE_ID_TYPE = "impureId";
    static PURE_ID_TYPE = "pureId";
    value = null;
    isExpression = true;
    constructor(lineNumber, value) {
        super(lineNumber, Id.type);
        this.value = value;
    }
    existsInScope(scope) {
        let scopePresence = scope.findId(this.value);
        // check if the id was found in the parent scope
        if (scopePresence) {
            return scopePresence;
        } else { // check if the id is imported in the global scope
            scopePresence = scope.globalScope.findImportedId(this.value);
            if (scopePresence) {
                return scopePresence;
            } else { // check if the id is present in the parent scope
                if (scope.parentScope === "global")
                    return false;
                return this.existsInScope(scope.parentScope);
            }
        }
    }
    resolve(scope) {
        // check if the id is valid for the passed scope
        const scopePresence = this.existsInScope(scope);
        // if we are impure inside of a pure scope
        if (scopePresence[0] === "i" && scope.type[0] === "p")
            console.log("hmmm... you tried to access " + this.value + " on line " + this.lineNumber + " but you are not allowed to use impure state inside of a pure scope!");
        if (!scopePresence)
            console.log("hmmm... you tried to access " + this.value + " on line " + this.lineNumber + " but it hasn't been declared anywhere visible.");
        return new Transpiled(this.value, [], this.lineNumber, this.lineNumber);
    }
}