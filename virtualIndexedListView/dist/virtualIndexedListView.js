/// <reference path="../typings/typescriptapp.d.ts" />
angular.module("virtualIndexedListView", ["rx"]);

//# sourceMappingURL=virtualIndexedListView.module.js.map
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
                            itemHeight: attributes["virtualIndexedListViewItemHeight"]
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
    angular.module("virtualIndexedListView").directive("virtualIndexedListView", ["virtualIndexedListView.getHtml", "virtualIndexedListViewManager", VirtualIndexedListView.createInstance]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../directives/virtualIndexedListView.js.map
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    "use strict";
    (function (ScrollingDirection) {
        ScrollingDirection[ScrollingDirection["Up"] = 0] = "Up";
        ScrollingDirection[ScrollingDirection["Down"] = 1] = "Down";
    })(VirtualIndexedListView.ScrollingDirection || (VirtualIndexedListView.ScrollingDirection = {}));
    var ScrollingDirection = VirtualIndexedListView.ScrollingDirection;
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../enums/scrollingDirection.js.map
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var ViewPort = (function () {
        function ViewPort($window) {
            var _this = this;
            this.$window = $window;
            this.createInstance = function (options) {
                var instance = new ViewPort(_this.$window);
                return instance;
            };
        }
        Object.defineProperty(ViewPort.prototype, "scrollY", {
            get: function () {
                return this.$window.pageYOffset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewPort.prototype, "height", {
            get: function () {
                return this.$window.innerHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewPort.prototype, "bottom", {
            get: function () {
                return this.scrollY + this.height;
            },
            enumerable: true,
            configurable: true
        });
        return ViewPort;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListView.viewPort", ["$window", ViewPort]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/viewPort.js.map
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
                var virtualIndexedListViewRenderer = _this.$injector.get("virtualIndexedListViewRenderer");
                var instance = new VirtualIndexedListViewManager(_this.$injector, _this.$interval, _this.$timeout, _this.$window);
                instance.element = options.element;
                instance.scope = options.scope;
                instance.template = options.template;
                instance.virtualIndexedListViewRenderer = virtualIndexedListViewRenderer.createInstance({
                    containerHeight: options.items.length * options.itemHeight,
                    items: options.items,
                    itemName: options.itemName,
                    itemHeight: options.itemHeight,
                    element: options.element,
                    scope: options.scope,
                    template: options.template
                });
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

//# sourceMappingURL=../services/virtualIndexedListViewManager.js.map
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
                if (_this.getScrollDirections(options.scrollY, options.lastScrollY) === VirtualIndexedListView.ScrollingDirection.Down) {
                }
                if (_this.getScrollDirections(options.scrollY, options.lastScrollY) === VirtualIndexedListView.ScrollingDirection.Up) {
                }
                _this.hasRendered = true;
            };
            this.getScrollDirections = function (scrollY, lastScrollY) {
                if (lastScrollY && scrollY > lastScrollY) {
                    return VirtualIndexedListView.ScrollingDirection.Down;
                }
                if (lastScrollY && scrollY < lastScrollY) {
                    return VirtualIndexedListView.ScrollingDirection.Up;
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

//# sourceMappingURL=../services/virtualIndexedListViewRenderer.js.map
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    "use strict";
    var getHtml = function (who, deep) {
        if (!who || !who.tagName)
            return '';
        var txt, ax, el = document.createElement("div");
        el.appendChild(who.cloneNode(false));
        txt = el.innerHTML;
        if (deep) {
            ax = txt.indexOf('>') + 1;
            txt = txt.substring(0, ax) + who.innerHTML + txt.substring(ax);
        }
        el = null;
        return txt;
    };
    angular.module("virtualIndexedListView").value("virtualIndexedListView.getHtml", getHtml);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../values/getHtml.js.map