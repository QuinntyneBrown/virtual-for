var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    "use strict";
    (function (collectionType) {
        collectionType[collectionType["collection"] = 0] = "collection";
        collectionType[collectionType["scope"] = 1] = "scope";
        collectionType[collectionType["filterable"] = 2] = "filterable";
        collectionType[collectionType["lazyLoad"] = 3] = "lazyLoad";
    })(VirtualIndexedListView.collectionType || (VirtualIndexedListView.collectionType = {}));
    var collectionType = VirtualIndexedListView.collectionType;
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../enums/collectionType.js.map