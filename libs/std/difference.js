class Difference {
    static name = "Difference";
    static type = "PureFunctions";
    static description = "Returns the difference of the passed arguments.";
    static resolve() {
        return function() {
            const args = [...arguments].flat();
            let t = (args.shift());
            args.forEach((arg)=>{
                t -= arg;
            });
            return t;
        }
    }
}
Difference;