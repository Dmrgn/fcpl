import { TokenTypes } from "./tokenTypes.js";

import { ImpureScope } from "./expressions/impureScope.js";
import { PureScope } from "./expressions/pureScope.js";
import { Expression } from "./expressions/expression.js";
import { Collection } from "./expressions/collection.js";

export class Parser {
    static createAst(tokens) {
        // create global impure scope that starts empty
        const ast = new ImpureScope(tokens, "global", "self", "global");
        Parser.parseScope(ast);
        return ast;
    }
    static parseScope(ast) {
        // temporary stack of tokens that have been read previously
        let stack = [];
        // checks if the pattern "(id/literal) pipe (id/literal)" is present on the
        // stack checks validity of the expression and returns it
        function isExpressionOnStack() {
            const stackTokens = [
                stack?.[stack.length-3], stack?.[stack.length-1]
            ];
            return stackTokens.every(token => token?.isExpression) && stack?.[stack.length-2].type === TokenTypes.PIPE_TYPE;
        }
        // pops items off the stack to form an expression 
        // in the pattern "(id/literal) pipe (id/literal)"
        function createExpression() {
            const firstTerm = stack[stack.length-3];
            const pipe = stack[stack.length-2];
            const secondTerm = stack[stack.length-1];
            let id, param;
            if (pipe.subtype === TokenTypes.PIPE_SUBTYPES.LEFT) {
                id = firstTerm;
                param = secondTerm;
            } else {
                id = secondTerm;
                param = firstTerm;
            }
            // pop the first term, the pipe operator 
            // and the second term off the stack
            stack.pop();
            stack.pop();
            stack.pop();
            return new Expression(id, param);
        }
        // creates a collection out of the tokens currently on the stack
        function createCollection() {
            const items = [];
            const closingBracket = stack.pop();
            while (stack[stack.length - 1]?.subtype !== TokenTypes.LITERAL_SUBTYPES.COLLECTION_START) {
                if (stack[stack.length - 1]?.subtype === TokenTypes.LITERAL_SUBTYPES.COLLECTION_PAUSE) {
                    stack.pop();
                    continue;
                }
                items.unshift(stack.pop());
                if (stack.length < 1) break;
            }
            return new Collection(items, stack.pop().line, closingBracket.line);
        }
        // consumes tokens until the embedded scope is
        // completed and then recursively parses it
        function createScope() {
            const tokens = [];
            const starter = ast.tokens.shift(); // { or [
            let ending;
            if (starter.subtype === TokenTypes.LITERAL_SUBTYPES.IMPURE_SCOPE_START)
                ending = TokenTypes.SCOPE_START_CHARS[3]; // ]
            else
                ending = TokenTypes.SCOPE_START_CHARS[1]; // }
            let finished = false;
            let numBeginings = 0;
            while (ast.tokens.length > 0) {
                if (ast.tokens[0].value == ending && numBeginings == 0) {
                    finished = true;
                    break;
                }
                if (ast.tokens[0].value == ending)
                    numBeginings--;
                if (ast.tokens[0].value == starter.value)
                    numBeginings++;
                tokens.push(ast.tokens.shift());
            }
            if (!finished) {
                console.log("hmmm this scope isnt finished or a bracket is misplaced on line '" + starter.line + "'");
            }
            if (starter.subtype === TokenTypes.LITERAL_SUBTYPES.IMPURE_SCOPE_START)
                return Parser.parseScope(new ImpureScope(tokens, "anonymous", ast.globalScope, ast));
            else
                return Parser.parseScope(new PureScope(tokens, "anonymous", ast.globalScope,));
        }
        // iterate through tokens and append to ast or stack
        while (ast.tokens.length > 0) {
            switch (ast.tokens[0].type) {
                case TokenTypes.LITERAL_TYPE:
                    // check if the end of a collection
                    if (ast.tokens[0].subtype === TokenTypes.LITERAL_SUBTYPES.COLLECTION_END) {
                        stack.push(ast.tokens[0]);
                        stack.push(createCollection());
                        if (isExpressionOnStack()) {
                            stack.push(createExpression());
                        }
                        break;
                    }
                    // check if the end of a scope
                    if (ast.tokens[0].subtype === TokenTypes.LITERAL_SUBTYPES.PURE_SCOPE_START || ast.tokens[0].subtype === TokenTypes.LITERAL_SUBTYPES.IMPURE_SCOPE_START) {
                        stack.push(createScope());
                        if (isExpressionOnStack()) {
                            stack.push(createExpression());
                        }
                        break;
                    }
                    stack.push(ast.tokens[0]);
                    if (isExpressionOnStack()) {
                        stack.push(createExpression());
                    }  
                    break;
                case TokenTypes.PIPE_TYPE:
                    if (stack.length == 0) {
                        console.error("hmmm there is an oddly placed pipe operator on line '" + ast.tokens[0].line + "'");
                        return ast;
                    }
                    if (stack[stack.length - 1].type === TokenTypes.PIPE_TYPE) {
                        console.error("hmmm two pipe operators in a row? on line '" + ast.tokens[0].line);
                        return ast;
                    }
                    stack.push(ast.tokens[0]);
                    break;
                case TokenTypes.ID_TYPE:
                    stack.push(ast.tokens[0]);
                    if (isExpressionOnStack()) {
                        stack.push(createExpression());
                    }
                    break;
                default:
                    console.error("hmmm what is this token type? '" + ast.tokens[0].type + "' at line " + ast.tokens[0].line);
                    return ast;
            }
            ast.tokens.shift()
        }
        ast.ast = stack;
        return ast;
    }
}