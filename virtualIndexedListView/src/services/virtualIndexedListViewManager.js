/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var VirtualIndexedListViewManager = (function () {
        function VirtualIndexedListViewManager($injector, $interval, $timeout, $window) {
            var _this = this;
            this.$injector = $injector;
            this.$interval = $interval;
            this.$timeout = $timeout;
            this.$window = $window;
            this.createInstance = function (options) {
                var instance = new VirtualIndexedListViewManager(_this.$injector, _this.$interval, _this.$timeout, _this.$window);
                instance.element = options.element;
                instance.scope = options.scope;
                instance.template = options.template;
                var virtualIndexedListViewRenderer = _this.$injector.get("virtualIndexedListViewRenderer");
                instance.virtualIndexedListViewRenderer = virtualIndexedListViewRenderer.createInstance({
                    containerHeight: options.items.length * options.itemHeight,
                    items: options.items,
                    itemName: options.itemName,
                    itemHeight: options.itemHeight,
                    element: options.element,
                    scope: options.scope,
                    template: options.template
                });
                instance.elementCSS = instance.$window.getComputedStyle(instance.element[0], null);
                if (instance.elementCSS && instance.elementCSS.overflowY && (instance.elementCSS.overflowY == "auto" || instance.elementCSS.overflowY == "scroll")) {
                    instance.element[0].addEventListener("scroll", instance.debouceRender);
                }
                _this.$window.addEventListener("mousewheel", instance.debouceRender);
                _this.$window.addEventListener("scroll", instance.onScroll);
                _this.$window.addEventListener("resize", instance.debouceRender);
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
            this.onScroll = function (e) {
                if (_this.lastScrollY == window.pageYOffset) {
                    setTimeout(_this.debouceRender, 100);
                    return;
                }
                else {
                    _this.lastScrollY = window.pageYOffset;
                }
            };
            this.lastScrollY = window.pageYOffset;
            this.scrollY = window.pageYOffset;
        }
        return VirtualIndexedListViewManager;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListViewManager", ["$injector", "$interval", "$timeout", "$window", VirtualIndexedListViewManager]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));
//# sourceMappingURL=virtualIndexedListViewManager.js.map