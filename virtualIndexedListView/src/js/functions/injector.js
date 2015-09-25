/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    "use strict";
    var Injector = (function () {
        function Injector($injector) {
            var _this = this;
            this.$injector = $injector;
            this.get = function (options) {
                switch (options.interface) {
                    case "ICollectionManager":
                        if (options.filterFnNameOnVm && options.searchTermNameOnScope) {
                            return _this.$injector.get("virtualIndexedListView.filterableCollectionManager").createInstance({ items: options.items, scope: options.scope, searchTermNameOnScope: options.searchTermNameOnScope, filterFnNameOnVm: options.filterFnNameOnVm });
                        }
                        else if (options.dataService) {
                            return _this.$injector.get("virtualIndexedListView.lazyLoadCollectionManager").createInstance({ items: options.items, dataService: options.dataService });
                        }
                        else {
                            return _this.$injector.get("virtualIndexedListView.collectionManager").createInstance({ items: options.items });
                        }
                    case "IViewPort":
                        return _this.$injector.get("virtualIndexedListView.viewPort").createInstance({ element: options.element });
                    case "IContainer":
                        return _this.$injector.get("virtualIndexedListView.container").createInstance({ element: options.element });
                    case "IRenderedNodes":
                        return _this.$injector.get("virtualIndexedListView.renderedNodes").createInstance({ container: options.container });
                }
            };
        }
        return Injector;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListView.injector", ["$injector", Injector]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../functions/injector.js.map