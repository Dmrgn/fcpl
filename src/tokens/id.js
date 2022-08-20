import { ImpureScope } from "../expressions/impureScope.js";
import { PureScope } from "../expressions/pureScope.js";
import { Transpiled } from "../expressions/transpiled.js";
import {Token} from "./token.js";

export class Id extends Token {
    static type = "id";
    static IMPURE_ID_TYPE = "impureId";
    static PURE_ID_TYPE = "pureId";
    static MAPPING = {};
    static IMPORTED_MAPPING = {};
    value = null;
    isExpression = true;
    constructor(lineNumber, value) {
        super(lineNumber, Id.type);
        this.value = value;
        if (!Id.MAPPING?.exists) {
            Id.MAPPING["exists"] = true;
            Id.MAPPING[Id.IMPURE_ID_TYPE] = "impureIds";
            Id.MAPPING[Id.PURE_ID_TYPE] = "pureIds";
            Id.MAPPING[ImpureScope.type] = "impureFunctions";
            Id.MAPPING[PureScope.type] = "pureFunctions";
            Id.IMPORTED_MAPPING[Id.IMPURE_ID_TYPE] = "importedImpureIds";
            Id.IMPORTED_MAPPING[Id.PURE_ID_TYPE] = "importedPureIds";
            Id.IMPORTED_MAPPING[ImpureScope.type] = "importedImpureFunctions";
            Id.IMPORTED_MAPPING[PureScope.type] = "importedPureFunctions";
        }
    }
    existsInScope(scope) {
        let scopePresence = scope.findId(this.value);
        let type = false;
        // check if the id was found in the parent scope
        if (scopePresence) {
            type = Id.MAPPING[scopePresence];
        } else { // check if the id is imported in the global scope
            scopePresence = scope.globalScope.findImportedId(this.value);
            if (scopePresence) {
                type = Id.IMPORTED_MAPPING[scopePresence];
            } else { // check if the id is present in the parent scope
                if (scope.parentScope === "global")
                    return false;
                type = this.existsInScope(scope.parentScope);
            }
        }
        return type;
    }
    resolve(scope) {
        // let output = `idNotFound["${this.value}"]`;
        // // check if this id is accessible in the current scope recursively
        // const scopePresence = this.existsInScope(scope);
        // if (!scopePresence) {
        //     console.log("hmmm... you've used the id " + this.value + " on line " + this.lineNumber + " but it hasnt been declared anywhere visible!");
        // }
        // return new Transpiled(output, [], this.lineNumber, this.lineNumber);
        return new Transpiled(this.value, [], this.lineNumber, this.lineNumber);
    }
}