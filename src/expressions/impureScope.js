import { Id } from "../tokens/id.js";
import { PureScope } from "./pureScope.js";
import { Scope } from "./scope.js";

export class ImpureScope extends Scope  {
    static type = "impureScopeExpression";
    impureIds = {};
    pureIds = {};
    pureFunctions = {};
    impureFunctions = {};
    constructor(tokens, id, globalScope) {
        super(ImpureScope.type, tokens, id, globalScope);
    }
    findId(name) {
        if (this.pureIds.hasOwnProperty(name)) return Id.PURE_ID_TYPE;
        if (this.pureFunctions.hasOwnProperty(name)) return PureScope.type;
        if (this.impureIds.hasOwnProperty(name)) return Id.IMPURE_ID_TYPE;
        if (this.impureFunctions.hasOwnProperty(name)) return ImpureScope.type;
        return false;
    }
}
