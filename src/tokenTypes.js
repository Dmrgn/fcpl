import { Literal } from "./tokens/literal.js";
import { Id } from "./tokens/id.js";
import { Pipe } from "./tokens/pipe.js";

export class TokenTypes {
    // virtual scope is created at compile time and displays as having the following line number
    static VIRTUAL_SCOPE_LINE_NUMBER = -2;
    // all accepted whitespace characters
    static WHITESPACE = " \n"
    // character used for comments
    static COMMENT_CHARACTER = "/";
    // token types
    static LITERAL_TYPE = Literal.type;
    static ID_TYPE = Id.type;
    static PIPE_TYPE = Pipe.type;
    static LITERAL_SUBTYPES = {
        NUMBER:"number",
        STRING:"string",
        COLLECTION_START:"collectionStart",
        COLLECTION_END:"collectionEnd",
        COLLECTION_PAUSE:"collectionPause",
        PURE_SCOPE_START:"pureScopeStart",
        PURE_SCOPE_END:"pureScopeEnd",
        IMPURE_SCOPE_START:"impureScopeStart",
        IMPURE_SCOPE_END:"impureScopeEnd",
    };
    static PIPE_SUBTYPES = {
        LEFT:"pipeLeft",
        RIGHT:"pipeRight",
    };
    // pipe characters
    static PIPE_CHARS = "|><";
    static PIPE_START_CHARS = "|><";
    static PIPE_LEFT = "<|";
    static PIPE_RIGHT = "|>";
    // literal characters
    static NUMBER_CHARS = "-0123456789.";
    static NUMBER_START_CHARS = "-0123456789";
    static STRING_CHARS = "\"'";
    static STRING_START_CHARS = "\"'";
    // start, end
    static COLLECTION_CHARS = "()"
    static COLLECTION_START_CHARS = "()"
    static COLLECTION_PAUSE_CHARS = ","
    // pure start, pure end, impure start, impure end
    static SCOPE_CHARS = "{}[]";
    static SCOPE_START_CHARS = "{}[]";
    // id characters
    static ID_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_."; 
    static ID_START_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
}