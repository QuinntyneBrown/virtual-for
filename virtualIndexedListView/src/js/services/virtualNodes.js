/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var VirtualNodes = (function () {
        function VirtualNodes() {
            this.createInstance = function (options) {
                var map = [];
                for (var i = 0; i < options.items; i++) {
                    var pageIndex = Math.floor(i / options.numberOfRenderedItems);
                    map.push({
                        index: i,
                        renderedNodeIndex: i - (pageIndex * options.numberOfRenderedItems),
                        pageIndex: pageIndex,
                        moveToY: pageIndex * options.itemHeight,
                        minScrollY: pageIndex * options.itemHeight * options.numberOfRenderedItems,
                        maxScrollY: (pageIndex + 1) * options.itemHeight * options.numberOfRenderedItems,
                        minScrollYThreshold: (i * options.itemHeight) + options.itemHeight,
                        maxScrollYThreshold: ((i + options.numberOfRenderedItems) * options.itemHeight) + options.itemHeight,
                        nextPosition: (i + pageIndex) * options.itemHeight,
                        nextIndex: (i + options.numberOfRenderedItems),
                        transform: pageIndex * options.itemHeight,
                        nextTransform: (pageIndex + 1) * options.itemHeight
                    });
                }
                return map;
            };
        }
        return VirtualNodes;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListView.virtualNodes", [VirtualNodes]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/virtualNodes.js.map