import { TokenTypes } from "./tokenTypes.js"

import { Literal } from "./tokens/literal.js";
import { Id } from "./tokens/id.js";
import { Pipe } from "./tokens/pipe.js";

export class Lexer {

    static lineNumber = -1;

    // identifys the next token in the raw text 'raw' starting from index 'index'
    static identifyNextToken(raw, index) {
        const token = {
            type: null,
            subtype: null,
            lineNumber: Lexer.lineNumber,
            raw: "",
        };
        // check between literal || id || pipe
        let starter;
        switch (true) {
            // check if a number literal
            case TokenTypes.NUMBER_START_CHARS.indexOf(raw[index]) > -1:
                token.type = TokenTypes.LITERAL_TYPE;
                token.subtype = TokenTypes.LITERAL_SUBTYPES.NUMBER;
                token.isExpression = true;
                while (index < raw.length && TokenTypes.NUMBER_CHARS.indexOf(raw[index]) > -1) {
                    token.raw += raw[index];
                    index++;
                }
                break;
            // check if a string literal
            case TokenTypes.STRING_START_CHARS.indexOf(raw[index]) > -1:
                starter = raw[index]; // ' or "
                token.type = TokenTypes.LITERAL_TYPE;
                token.subtype = TokenTypes.LITERAL_SUBTYPES.STRING;
                index++;
                token.raw += starter;
                token.isExpression = true;
                while (raw[index] != starter) {
                    if (index > raw.length) {
                        console.error("hmmm I think you forgot to close off this string... at line: " + this.lineNumber);
                        return null;
                    }
                    token.raw += raw[index];
                    index++;
                }
                token.raw += starter;
                break;
            // check if a collection literal
            case TokenTypes.COLLECTION_START_CHARS.indexOf(raw[index]) > -1:
                starter = raw[index]; // ) or (
                token.type = TokenTypes.LITERAL_TYPE;
                if (starter == TokenTypes.COLLECTION_CHARS[0])
                    token.subtype = TokenTypes.LITERAL_SUBTYPES.COLLECTION_START;
                else 
                    token.subtype = TokenTypes.LITERAL_SUBTYPES.COLLECTION_END;
                token.raw=starter;
                index++;
                break;
            // check if a pause in a collection literal
            case TokenTypes.COLLECTION_PAUSE_CHARS.indexOf(raw[index]) > -1:
                token.type = TokenTypes.LITERAL_TYPE;
                token.subtype = TokenTypes.LITERAL_SUBTYPES.COLLECTION_PAUSE;
                token.raw=raw[index];
                index++;
                break;
            // check if a scope literal
            case TokenTypes.SCOPE_START_CHARS.indexOf(raw[index]) > -1:
                starter = raw[index]; // { or } or [ or ]
                token.type = TokenTypes.LITERAL_TYPE;
                switch (starter) { // goes {}[]
                    case TokenTypes.SCOPE_CHARS[0]:
                        token.subtype = TokenTypes.LITERAL_SUBTYPES.PURE_SCOPE_START;
                        break;
                    case TokenTypes.SCOPE_CHARS[1]:
                        token.subtype = TokenTypes.LITERAL_SUBTYPES.PURE_SCOPE_END;
                        break;
                    case TokenTypes.SCOPE_CHARS[2]:
                        token.subtype = TokenTypes.LITERAL_SUBTYPES.IMPURE_SCOPE_START;
                        break;
                    case TokenTypes.SCOPE_CHARS[3]:
                        token.subtype = TokenTypes.LITERAL_SUBTYPES.IMPURE_SCOPE_END;
                        break;
                }
                token.raw=starter;
                index++;
                break;
            case TokenTypes.ID_START_CHARS.indexOf(raw[index]) > -1:
                token.type = TokenTypes.ID_TYPE;
                token.subtype = TokenTypes.ID_TYPE;    
                while (index < raw.length && TokenTypes.ID_CHARS.indexOf(raw[index]) > -1) {
                    token.raw += raw[index];
                    index++;
                }
                break;
            case TokenTypes.PIPE_START_CHARS.indexOf(raw[index]) > -1:
                starter = raw.slice(index, index+2); // |> or <|
                token.type = TokenTypes.PIPE_TYPE;
                if (starter == TokenTypes.PIPE_RIGHT) {
                    token.subtype = TokenTypes.PIPE_SUBTYPES.RIGHT;
                    token.raw = TokenTypes.PIPE_RIGHT;
                    break;
                } else if (starter == TokenTypes.PIPE_LEFT) {
                    token.subtype = TokenTypes.PIPE_SUBTYPES.LEFT;
                    token.raw = TokenTypes.PIPE_LEFT;
                } else {
                    console.error("hmmm what is this? '" + raw[index] + "' at line: " + this.lineNumber);
                    return null;
                }
                index+=2;
                break;
            case raw[index] === TokenTypes.COMMENT_CHARACTER && raw[index+1] === TokenTypes.COMMENT_CHARACTER:
                let length = 0;
                while (index < raw.length && raw[index] != "\n") {
                    index++;
                    length++;
                }
                return {type:"comment", length:length};
            default:
                console.error("hmmm what is this? " + JSON.stringify(raw[index]) + " at line: " + this.lineNumber);
                return null;
        }
        return token
    }
    // parses a single raw token into an instance of a token object
    static parseRawToken(rawToken) {
        let token;
        const LIT_SUBTYPES = TokenTypes.LITERAL_SUBTYPES;
        switch (rawToken.type) {
            case TokenTypes.LITERAL_TYPE:
                switch (true) {
                    case rawToken.subtype == LIT_SUBTYPES.NUMBER:
                        const number = Number(rawToken.raw);
                        if (isNaN(number))
                            console.error("hmmm... what is this? '" + rawToken.raw + "' ... was kinda expecting a number there instead...");
                        token = new Literal(rawToken.lineNumber, LIT_SUBTYPES.NUMBER, Number(rawToken.raw));
                        token.isExpression = true;
                        break;
                    case rawToken.subtype == LIT_SUBTYPES.STRING:
                        token = new Literal(rawToken.lineNumber, LIT_SUBTYPES.STRING, rawToken.raw);
                        token.isExpression = true;
                        break;
                    case rawToken.subtype == LIT_SUBTYPES.COLLECTION_START || rawToken.subtype == LIT_SUBTYPES.COLLECTION_END || rawToken.subtype == LIT_SUBTYPES.COLLECTION_PAUSE:
                        token = new Literal(rawToken.lineNumber, rawToken.subtype, rawToken.raw);
                        break;
                    case rawToken.subtype == LIT_SUBTYPES.IMPURE_SCOPE_START || rawToken.subtype == LIT_SUBTYPES.IMPURE_SCOPE_END || rawToken.subtype == LIT_SUBTYPES.PURE_SCOPE_START || rawToken.subtype == LIT_SUBTYPES.PURE_SCOPE_END:
                        token = new Literal(rawToken.lineNumber, rawToken.subtype, rawToken.raw);
                        break;
                    default:
                        console.error("hmmm what is this literal subtype? '" + rawToken.subtype + "'");
                        break;
                }
                break;
            case TokenTypes.ID_TYPE:
                token = new Id(rawToken.lineNumber, rawToken.raw);
                break;
            case TokenTypes.PIPE_TYPE:
                token = new Pipe(rawToken.lineNumber, rawToken.subtype);
                break;
            default:
                console.error("hmmm what is this token type? '" + rawToken.type + "'");
                return null;
        }
        return token;
    }
    // turns the raw source code into an array of tokens
    static tokenize(input) {
        let tokens = [];
        let index = 0;
        Lexer.lineNumber = 1;
        while (index < input.length) {
            if (TokenTypes.WHITESPACE.indexOf(input[index]) > -1) {
                if (input[index] === '\n')
                    Lexer.lineNumber++;
                index++;
                continue;
            }
            const nextTokenRaw = Lexer.identifyNextToken(input, index);
            if (nextTokenRaw.type === "comment") {
                index += nextTokenRaw.length;
                continue;
            }
            if (nextTokenRaw == null) return tokens;
            index += nextTokenRaw.raw.length;
            const nextToken = Lexer.parseRawToken(nextTokenRaw);
            tokens.push(nextToken);
        }
        return tokens;
    };
}