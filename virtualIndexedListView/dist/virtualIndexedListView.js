/// <reference path="../typings/angularjs/angular.d.ts" />
angular.module("virtualIndexedListView", []);

//# sourceMappingURL=virtualIndexedListView.module.js.map
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView_1) {
    var VirtualIndexedListView = (function () {
        function VirtualIndexedListView(getHtml, virtualIndexedListManager) {
            var _this = this;
            this.getHtml = getHtml;
            this.virtualIndexedListManager = virtualIndexedListManager;
            this.restirct = "A";
            this.transclude = 'element';
            this.scope = false;
            this.compile = function (template) {
                var virtualIndexedListManager = _this.virtualIndexedListManager;
                var parentElement = template.parent();
                var getHTML = _this.getHtml;
                return function (scope, element, attributes, controller, transclude) {
                    transclude(scope.$new(), function (clone) {
                        removeVirtualListCustomAttributes(clone);
                        virtualIndexedListManager.createInstance({
                            element: angular.element(parentElement),
                            template: getHTML(clone[0], true),
                            scope: scope,
                            items: scope[attributes["virtualIndexedListViewCollectionName"]],
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
                }
            };
        }
        VirtualIndexedListView.createInstance = function (getHtml, virtualIndexedListManager) {
            return new VirtualIndexedListView(getHtml, virtualIndexedListManager);
        };
        return VirtualIndexedListView;
    })();
    VirtualIndexedListView_1.VirtualIndexedListView = VirtualIndexedListView;
    angular.module("virtualIndexedListView").directive("virtualIndexedListView", ["getHtml", "virtualIndexedListManager", VirtualIndexedListView.createInstance]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../directives/virtualIndexedListView.js.map
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
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var getHtml = function () {
    };
    angular.module("virtualIndexedListView").value("getHtml", getHtml);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../values/getHTML.js.map