/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    "use strict";
    var VirtualIndexedListViewRenderer = (function () {
        function VirtualIndexedListViewRenderer($compile, $injector, $interval) {
            var _this = this;
            this.$compile = $compile;
            this.$injector = $injector;
            this.$interval = $interval;
            this.createInstance = function (options) {
                var instance = new VirtualIndexedListViewRenderer(_this.$compile, _this.$injector, _this.$interval);
                instance.containerHeight = options.containerHeight;
                instance.items = options.items;
                instance.itemName = options.itemName;
                instance.scope = options.scope;
                instance.element = options.element;
                instance.template = options.template;
                instance.itemHeight = options.itemHeight;
                instance.viewPort = _this.$injector.get("virtualIndexedListView.viewPort").createInstance({ element: _this.element });
                setInterval(function () {
                    if (instance.lastYScroll != instance.viewPort.scrollY) {
                        instance.render({ scrollY: instance.viewPort.scrollY, lastScrollY: instance.lastYScroll, viewPortHeight: instance.viewPort.height });
                    }
                    instance.lastYScroll = instance.viewPort.scrollY;
                }, 200);
                return instance;
            };
            this.render = function (options) {
                if (_this.hasRendered === false) {
                    var containerElement = angular.element("<div class='container'></div>");
                    containerElement.css("height", _this.containerHeight);
                    _this.element.append(containerElement);
                    for (var i = 0; i < _this.numberOfRenderedItems; i++) {
                        var childScope = _this.scope.$new(true);
                        childScope[_this.itemName] = _this.items[i];
                        var itemContent = _this.$compile(angular.element(_this.template))(childScope);
                        containerElement.append(itemContent);
                    }
                }
                if (_this.getScrollDirections(options.scrollY, options.lastScrollY) === 1 /* Down */) {
                }
                if (_this.getScrollDirections(options.scrollY, options.lastScrollY) === 0 /* Up */) {
                }
                _this.hasRendered = true;
            };
            this.getScrollDirections = function (scrollY, lastScrollY) {
                if (lastScrollY && scrollY > lastScrollY) {
                    return 1 /* Down */;
                }
                if (lastScrollY && scrollY < lastScrollY) {
                    return 0 /* Up */;
                }
                return null;
            };
            this.hasRendered = false;
            this.lastYScroll = 0;
        }
        Object.defineProperty(VirtualIndexedListViewRenderer.prototype, "numberOfRenderedItems", {
            get: function () {
                var maximumScreenSize = 1380;
                return Math.ceil(maximumScreenSize / this.itemHeight);
            },
            enumerable: true,
            configurable: true
        });
        return VirtualIndexedListViewRenderer;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListViewRenderer", ["$compile", "$injector", "$interval", VirtualIndexedListViewRenderer]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));
//# sourceMappingURL=virtualIndexedListViewRenderer.js.map