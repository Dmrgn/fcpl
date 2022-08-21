class Join {
    static name = "Join";
    static type = "PureFunctions";
    static description = "Joins together the passed collection into a String separated by the delimiter.";
    static resolve() {
        return function() {
            const a = [...arguments];
            return a[0].join(a[1]);
        }
    }
}
Join;