class Print {
    // type can be any of:
    // -    PureIds
    // -    PureFunctions
    // -    ImpureIds
    // -    ImpureFunctions
    static name = "Print";
    static type = "PureFunctions";
    static description = "Takes any number of arguments and logs them to the console. Returns the passed arguments.";
    static resolve() {
        return function() {
            console.log(...arguments);
            return arguments.length > 1 ? arguments : arguments[0];
        }
    }
}
Print;