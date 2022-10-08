class Modulo {
    static name = "Modulo";
    static type = "PureFunctions";
    static description = "Returns first argument modulo (%) the second argument.";
    static resolve() {
        return function() {
            const args = [...arguments].flat();
            return args[0]%args[1];
        }
    }
}
Modulo;