class Exponent {
    static name = "Exponent";
    static type = "PureFunctions";
    static description = "Returns the first argument to the power of the second argument.";
    static resolve() {
        return function() {
            const args = [...arguments].flat();
            return args[0]**args[1];
        }
    }
}
Exponent;