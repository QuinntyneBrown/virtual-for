/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    "use strict";
    var getRenderedNodesComputedInfo = function (options) {
        var computedInfo = [];
        for (var i = 0; i < options.renderedNodes.length; i++) {
            var y = options.getY(options.renderedNodes[i]);
            var offsetTop = options.renderedNodes[i].offsetTop;
            var itemHeight = options.itemHeight;
            computedInfo.push({
                top: y + offsetTop,
                bottom: y + offsetTop + itemHeight,
                index: angular.element(options.renderedNodes[i]).scope().$$index,
                node: options.renderedNodes[i]
            });
        }
        if (options.desc) {
            computedInfo.sort(function (a, b) {
                return b.top - a.top;
            });
        }
        else {
            computedInfo.sort(function (a, b) {
                return a.top - b.top;
            });
        }
        return computedInfo;
    };
    angular.module("virtualIndexedListView").value("virtualIndexedListView.getRenderedNodesComputedInfo", getRenderedNodesComputedInfo);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));
//# sourceMappingURL=getRenderedNodesComputedInfo.js.map