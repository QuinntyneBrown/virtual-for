/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var VirtualIndexedListViewManager = (function () {
        function VirtualIndexedListViewManager($injector, $timeout) {
            var _this = this;
            this.$injector = $injector;
            this.$timeout = $timeout;
            this.createInstance = function (options) {
                var instance = new VirtualIndexedListViewManager(_this.$injector, _this.$timeout);
                instance.element = options.element;
                instance.scope = options.scope;
                instance.template = options.template;
                var virtualIndexedListViewRenderer = _this.$injector.get("virtualIndexedListViewRenderer");
                instance.virtualIndexedListViewRenderer = virtualIndexedListViewRenderer.createInstance({
                    containerHeight: options.items.length * 10,
                    items: options.items,
                    itemName: options.itemName,
                    itemHeight: options.itemHeight,
                    element: options.element,
                    scope: options.scope,
                    template: options.template
                });
                instance.elementCSS = options.window.getComputedStyle(instance.element[0], null);
                if (instance.elementCSS && instance.elementCSS.overflowY && (instance.elementCSS.overflowY == "auto" || instance.elementCSS.overflowY == "scroll")) {
                    instance.element[0].addEventListener("scroll", instance.debouceRender);
                }
                options.window.addEventListener("mousewheel", instance.debouceRender);
                options.window.addEventListener("scroll", instance.debouceRender);
                options.window.addEventListener("resize", instance.debouceRender);
                return instance;
            };
            this.render = function (options) {
                _this.virtualIndexedListViewRenderer.render({});
            };
            this.debouceRender = function () {
                _this.$timeout.cancel(_this.timer);
                _this.timer = _this.$timeout(function () {
                    _this.render({});
                }, 250, false);
            };
        }
        return VirtualIndexedListViewManager;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListViewManager", ["$injector", "$timeout", VirtualIndexedListViewManager]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));
//# sourceMappingURL=virtualIndexedListViewManager.js.map