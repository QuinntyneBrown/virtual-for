/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    "use strict";

    var getScrollDirection = (scrollY: number, lastScrollY: number): ScrollingDirection => {
        if (lastScrollY && scrollY > lastScrollY) {
            return ScrollingDirection.Down;
        }

        if (lastScrollY && scrollY < lastScrollY) {
            return ScrollingDirection.Up;
        }

        if (lastScrollY && scrollY === lastScrollY) {
            return ScrollingDirection.None;
        }

        return null;
    }

    angular.module("virtualIndexedListView").value("virtualIndexedListView.getScrollDirection", getScrollDirection);
} 