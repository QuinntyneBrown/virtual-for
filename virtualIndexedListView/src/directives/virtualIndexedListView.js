/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView_1) {
    var VirtualIndexedListView = (function () {
        function VirtualIndexedListView(getHtml, virtualIndexedListViewManager) {
            var _this = this;
            this.getHtml = getHtml;
            this.virtualIndexedListViewManager = virtualIndexedListViewManager;
            this.restirct = "A";
            this.transclude = 'element';
            this.scope = false;
            this.compile = function (template) {
                var virtualIndexedListViewManager = _this.virtualIndexedListViewManager;
                var parentElement = template.parent();
                var getHtml = _this.getHtml;
                return function (scope, element, attributes, controller, transclude) {
                    transclude(scope.$new(), function (clone) {
                        removeVirtualListCustomAttributes(clone);
                        virtualIndexedListViewManager.createInstance({
                            element: angular.element(parentElement),
                            template: getHtml(clone[0], true),
                            scope: scope,
                            items: attributes["virtualIndexedListViewItems"] ? JSON.parse(attributes["virtualIndexedListViewItems"]) : scope[attributes["virtualIndexedListViewCollectionName"]],
                            itemName: attributes["virtualIndexedListViewItemName"],
                            itemHeight: attributes["virtualIndexedListViewItemHeight"],
                            window: window
                        }).render();
                    });
                };
                function removeVirtualListCustomAttributes(clone) {
                    clone[0].removeAttribute("virtual-indexed-list-view");
                    clone[0].removeAttribute("virtual-indexed-list-view-collection-name");
                    clone[0].removeAttribute("virtual-indexed-list-view-item-name");
                    clone[0].removeAttribute("virtual-indexed-list-view-item-height");
                    clone[0].removeAttribute("virtual-indexed-list-view-items");
                }
            };
        }
        VirtualIndexedListView.createInstance = function (getHtml, virtualIndexedListViewManager) {
            return new VirtualIndexedListView(getHtml, virtualIndexedListViewManager);
        };
        return VirtualIndexedListView;
    })();
    VirtualIndexedListView_1.VirtualIndexedListView = VirtualIndexedListView;
    angular.module("virtualIndexedListView").directive("virtualIndexedListView", ["getHtml", "virtualIndexedListViewManager", VirtualIndexedListView.createInstance]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));
//# sourceMappingURL=virtualIndexedListView.js.map