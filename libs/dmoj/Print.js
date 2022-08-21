class Print {
    static name = "Print";
    static type = "PureFunctions";
    static description = "Determines if the script is running inside of dmoj and uses the apropriate print method.";
    static resolve() {
        return function() {
            if (typeof print !== 'undefined') {
                print(...arguments);
            } else {
                console.log(...arguments);
            }
            return arguments.length > 1 ? arguments : arguments[0];
        }
    }
}
Print;