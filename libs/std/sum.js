class Sum {
    static name = "Sum";
    static type = "PureFunctions";
    static description = "Returns the sum of the passed arguments.";
    static resolve() {
        return function() {
            let t = 0;
            [...arguments].flat().forEach((arg)=>{
                t += arg;
            });
            return t;
        }
    }
}
Sum;