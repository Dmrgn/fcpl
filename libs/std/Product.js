class Product {
    static name = "Product";
    static type = "PureFunctions";
    static description = "Returns the multiplicative product of the passed arguments.";
    static resolve() {
        return function() {
            let t = 1;
            [...arguments].flat().forEach((arg)=>{
                t *= arg;
            });
            return t;
        }
    }
}
Product;