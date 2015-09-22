/// <reference path="../../typings/typescriptapp.d.ts" />
/// <reference path="../enums/scrollingdirection.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    "use strict";
    var getScrollDirection = function (scrollY, lastScrollY) {
        if (lastScrollY && scrollY > lastScrollY) {
            return VirtualIndexedListView.ScrollingDirection.Down;
        }
        if (lastScrollY && scrollY < lastScrollY) {
            return VirtualIndexedListView.ScrollingDirection.Up;
        }
        if (lastScrollY && scrollY === lastScrollY) {
            return VirtualIndexedListView.ScrollingDirection.None;
        }
        return null;
    };
    angular.module("virtualIndexedListView").value("virtualIndexedListView.getScrollDirection", getScrollDirection);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../functions/getScrollDirection.js.map