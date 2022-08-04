class Reverse {
    static name = "Reverse";
    static type = "PureFunctions";
    static description = "Returns the reverse of the passed collection argument.";
    static resolve() {
        return function() {
            return [...arguments].flat().reverse();
        }
    }
}
Reverse;