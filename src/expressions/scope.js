import { Id } from "../tokens/id.js";
import { ImpureScope } from "./impureScope.js";
import { PureScope } from "./pureScope.js";

export class Scope  {
    static type = "scopeExpression";
    type = null;
    unWrapOnCompile = false;
    isExpression = true;
    glocalScope = null;
    constructor(type, tokens, id, globalScope) {
        this.type = type ?? Scope.type;
        this.tokens = tokens;
        this.id = id;
        this.globalScope = globalScope;
        this.lineNumberStart = this.tokens[0].line;
        this.lineNumberEnd = this.tokens[this.tokens.length - 1].line;
        // if this is the global scope
        if (this.globalScope == "self") {
            this.globalScope = this;
            this.importedPureIds = [];
            this.importedPureFunctions = [];
            this.importedImpureIds = [];
            this.importedImpureFunctions = [];
            this.findImportedId = function(name) {
                if (this.importedPureIds.hasOwnProperty(name)) return Id.PURE_ID_TYPE;
                if (this.importedPureFunctions.hasOwnProperty(name)) return PureScope.type;
                if (this.importedImpureIds.hasOwnProperty(name)) return Id.IMPURE_ID_TYPE;
                if (this.importedImpureFunctions.hasOwnProperty(name)) return ImpureScope.type;
                return false;
            }
        }
    }
}