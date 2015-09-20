/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var VirtualIndexedListViewManager = (function () {
        function VirtualIndexedListViewManager() {
            this.createInstance = function (options) {
                var instance = new VirtualIndexedListViewManager();
                return instance;
            };
            this.render = function () {
            };
        }
        return VirtualIndexedListViewManager;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListViewManager", [VirtualIndexedListViewManager]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/virtualIndexedListViewManager.js.map