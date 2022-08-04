class Quotient {
    static name = "Quotient";
    static type = "PureFunctions";
    static description = "Returns the quotient of the passed arguments.";
    static resolve() {
        return function() {
            const args = [...arguments].flat();
            let t = (args.shift());
            args.forEach((arg)=>{
                t /= arg;
            });
            return t;
        }
    }
}
Quotient;