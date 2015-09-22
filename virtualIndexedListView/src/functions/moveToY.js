/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    VirtualIndexedListView.moveToY = function (element, y) {
        var offSet = element.offsetTop;
        var parentOffSet = element.parentNode.offsetTop;
        var relativeOffSet = parentOffSet - offSet;
        y = y - relativeOffSet;
        angular.element(element).css({
            "-moz-transform": "translateY(" + y + "px)",
            "-webkit-transform": "translateY(" + y + "px)",
            "-ms-transform": "translateY(" + y + "px)",
            "-transform": "translateY(" + y + "px)"
        });
        return element;
    };
    angular.module("virtualIndexedListView").value("virtualIndexedListView.moveToY", VirtualIndexedListView.moveToY);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));
//# sourceMappingURL=moveToY.js.map