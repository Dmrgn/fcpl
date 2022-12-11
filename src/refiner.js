import { TokenTypes } from "./tokenTypes.js";
import { Collection } from "./expressions/collection.js";
import { Expression } from "./expressions/expression.js";
import { ImpureScope } from "./expressions/impureScope.js";
import { PureScope } from "./expressions/pureScope.js";
import { TranspiledFunction } from "./expressions/transpiledFunction.js";
import { Transpiled } from "./expressions/transpiled.js";

import { PureAssign } from "./functions/pureAssign.js";
import { ImpureAssign } from "./functions/impureAssign.js";
import { Fun } from "./functions/fun.js"
import { Return } from "./functions/return.js";
import { Index } from "./functions/index.js";
import { For } from "./functions/for.js";
import { Id } from "./tokens/id.js";
import { Import } from "./functions/import.js";
import { If } from "./functions/if.js";
import { And } from "./functions/and.js";
import { Or } from "./functions/or.js";
import { Not } from "./functions/not.js";
import { GreaterThan } from "./functions/greaterThan.js";
import { GreaterOrEqualTo } from "./functions/greaterOrEqualTo.js";
import { LessThan } from "./functions/lessThan.js";
import { LessOrEqualTo } from "./functions/lessOrEqualTo.js";
import { EqualTo } from "./functions/equalTo.js";
import { Mutate } from "./functions/mutate.js"
import { Property } from "./functions/property.js";


// looks for logic and structure errors
// runs compile-time functions
export class Refiner {
    static compileFunctions = {
        "PureAssign":PureAssign,
        "ImpureAssign":ImpureAssign,
        "Fun":Fun,
        "Return":Return,
        "Index":Index,
        "For":For,
        "Import":Import,
        "If":If,
        "And":And,
        "Or":Or,
        "Not":Not,
        "GreaterThan":GreaterThan,
        "GreaterOrEqualTo":GreaterOrEqualTo,
        "LessThan":LessThan,
        "LessOrEqualTo":LessOrEqualTo,
        "EqualTo":EqualTo,
        "Mutate":Mutate,
        "Property":Property,
    }
    static refineAst(ast) {
        function refineChild(child) {
            switch (child.type) {
                case ImpureScope.type:
                    return Refiner.refineAst(child);
                case PureScope.type:
                    return Refiner.refineAst(child);
                case Id.type:
                    return child.resolve(ast);
                case TranspiledFunction.type:
                    child.toCompile = [refineChild(child.toCompile[0])];
                    return child;
                case Expression.type:
                    // check if there is a compile function with the same name
                    if (!Refiner.compileFunctions[child.functionId.value]) {
                        // refine the functionId of this expression (check if it exists etc.)
                        child.functionId = child.functionId.resolve(ast);
                        // refine the arguments of this expression
                        if (child.parameter.type === Collection.type) {
                            for (const item in child.parameter.items) {
                                child.parameter.items[item] = refineChild(child.parameter.items[item]);
                            }
                        } else {
                            child.parameter = refineChild(child.parameter);
                        }
                    } else {
                        const refined = Refiner.compileFunctions[child.functionId.value].resolve(child, ast);
                        for (const item in refined.toCompile) {
                            refined.toCompile[item] = refineChild(refined.toCompile[item]);
                        }
                        return refined;
                    }
                    break;
                default:
                    return child;
            }
            return child;
        }
        const tree = ast.ast;
        for (let i = 0; i < tree.length; i++) {
            tree[i] = refineChild(tree[i]);
        }
        return ast;
    }
}