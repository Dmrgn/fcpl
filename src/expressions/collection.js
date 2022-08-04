export class Collection {
    static type = "collectionExpression";
    type = null;
    items = [];
    lineNumberStart = null;
    lineNumberEnd = null;
    isExpression = true;
    constructor(items, lineNumberStart, lineNumberEnd) {
        this.type = Collection.type;
        this.items = items;
        this.lineNumberStart = lineNumberStart;
        this.lineNumberEnd = lineNumberEnd;
    }
}