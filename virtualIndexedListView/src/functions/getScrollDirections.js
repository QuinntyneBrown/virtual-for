/// <reference path="../../typings/typescriptapp.d.ts" />
/// <reference path="../enums/scrollingdirection.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    "use strict";
    var getScrollDirection = function (scrollY, lastScrollY) {
        if (lastScrollY && scrollY > lastScrollY) {
            return 1 /* Down */;
        }
        if (lastScrollY && scrollY < lastScrollY) {
            return 0 /* Up */;
        }
        if (lastScrollY && scrollY === lastScrollY) {
            return 2 /* None */;
        }
        return null;
    };
    angular.module("virtualIndexedListView").value("virtualIndexedListView.getScrollDirection", getScrollDirection);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));
//# sourceMappingURL=getScrollDirections.js.map