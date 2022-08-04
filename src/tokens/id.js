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
    resolve(scope) {
        let output = `idNotFound["${this.value}"]`;
        let scopePresence = scope.findId(this.value);
        // check if the id was found in the parent scope
        if (scopePresence) {
            const mapping = {}
            mapping[Id.IMPURE_ID_TYPE] = "impureIds";
            mapping[Id.PURE_ID_TYPE] = "pureIds";
            mapping[ImpureScope.type] = "impureFunctions";
            mapping[PureScope.type] = "pureFunctions";
            output = `${mapping[scopePresence]}["${this.value}"]`;
        } else { // check if the id is imported in the global scope
            scopePresence = scope.globalScope.findImportedId(this.value);
            if (scopePresence) {
                const mapping = {}
                mapping[Id.IMPURE_ID_TYPE] = "importedImpureIds";
                mapping[Id.PURE_ID_TYPE] = "importedPureIds";
                mapping[ImpureScope.type] = "importedImpureFunctions";
                mapping[PureScope.type] = "importedPureFunctions";
                output = `${mapping[scopePresence]}["${this.value}"]`;
            }
        }
        if (!scopePresence) {
            console.log("hmmm... you've used the id " + this.value + " on line " + this.lineNumber + " but it hasnt been declared anywhere visible!");
        }

        return new Transpiled(output, [], this.lineNumber, this.lineNumber);
    }
}