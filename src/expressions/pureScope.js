import { Id } from "../tokens/id.js";
import { Scope } from "./scope.js";

export class PureScope extends Scope  {
    static type = "pureScopeExpression";
    pureIds = {};
    pureFunctions = {};
    constructor(tokens, id, globalScope, parentScope) {
        super(PureScope.type, tokens, id, globalScope, parentScope);
    }
    findId(name) {
        if (this.pureIds.hasOwnProperty(name)) return Id.PURE_ID_TYPE;
        if (this.pureFunctions.hasOwnProperty(name)) return PureScope.type;
        return false;
    }
}
