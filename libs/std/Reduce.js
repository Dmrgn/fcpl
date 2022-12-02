class Reduce {
    static name = "Reduce";
    static type = "PureFunctions";
    static description = "Creates a single value by running a function over every element of a collection.";
    static resolve() {
        return function() {
            let a = [...arguments];
            return a[0].reduce(a[1], a[2]);
        }
    }
}
Reduce;