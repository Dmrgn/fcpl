class Concat {
    static name = "Concat";
    static type = "PureFunctions";
    static description = "Concatenates the passed Collections.";
    static resolve() {
        return function() {
            let args = [...arguments];
            const a = args.shift();
            return a.concat(...args);
        }
    }
}
Concat;