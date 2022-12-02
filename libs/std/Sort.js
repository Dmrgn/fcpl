class Sort {
    static name = "Sort";
    static type = "PureFunctions";
    static description = "Returns a sorted version of the passed array by the sorting function.";
    static resolve() {
        return function() {
            let a = [...arguments]
            return a[1] == 0 ? a[0].sort() : a[0].sort(a[1]);
        }
    }
}
Sort;