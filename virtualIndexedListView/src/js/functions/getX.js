/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    VirtualIndexedListView.getX = function (element) {
        var transform = angular.element(element).css("transform");
        if (transform === "none") {
            return 0;
        }
        return JSON.parse(transform.replace(/^\w+\(/, "[").replace(/\)$/, "]"))[6];
    };
    angular.module("virtualIndexedListView").value("virtualIndexedListView.getX", VirtualIndexedListView.getX);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../functions/getX.js.map