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
        ScrollingDirection[ScrollingDirection["None"] = 2] = "None";
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
                instance.element = options.element;
                return instance;
            };
        }
        Object.defineProperty(ViewPort.prototype, "scrollY", {
            get: function () {
                if (this.element.css("overflowY") == "scroll")
                    return this.element[0].scrollTop;
                return this.$window.pageYOffset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewPort.prototype, "height", {
            get: function () {
                if (this.element.css("overflowY") == "scroll")
                    return this.element[0].offsetHeight;
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
        function VirtualIndexedListViewRenderer($compile, $injector, $interval, getY, transformY) {
            var _this = this;
            this.$compile = $compile;
            this.$injector = $injector;
            this.$interval = $interval;
            this.getY = getY;
            this.transformY = transformY;
            this.createInstance = function (options) {
                var instance = new VirtualIndexedListViewRenderer(_this.$compile, _this.$injector, _this.$interval, _this.getY, _this.transformY);
                instance.containerHeight = options.containerHeight;
                instance.items = options.items;
                instance.itemName = options.itemName;
                instance.scope = options.scope;
                instance.element = options.element;
                instance.template = options.template;
                instance.itemHeight = Number(options.itemHeight);
                instance.viewPort = _this.$injector.get("virtualIndexedListView.viewPort").createInstance({ element: instance.element });
                if (instance.numberOfRenderedItems > instance.items.length)
                    instance.numberOfRenderedItems = instance.items.length;
                setInterval(function () {
                    instance.render({
                        scrollY: instance.viewPort.scrollY,
                        lastScrollY: instance.lastYScroll,
                        viewPortHeight: instance.viewPort.height
                    });
                    instance.lastYScroll = instance.viewPort.scrollY;
                }, 10);
                return instance;
            };
            this.render = function (options) {
                var containerElement;
                if (_this.hasRendered === false) {
                    containerElement = angular.element("<div class='container'></div>");
                    containerElement.css("height", _this.containerHeight);
                    _this.element.append(containerElement);
                    for (var i = 0; i < _this.numberOfRenderedItems; i++) {
                        var childScope = _this.scope.$new(true);
                        childScope[_this.itemName] = _this.items[i];
                        childScope.$$index = i;
                        var itemContent = _this.$compile(angular.element(_this.template))(childScope);
                        containerElement.append(itemContent);
                    }
                }
                if (_this.getScrollDirections(options.scrollY, options.lastScrollY) === VirtualIndexedListView.ScrollingDirection.Down) {
                    var reachedBottom = false;
                    var allNodesHaveBeenMoved = false;
                    var item = null;
                    var index = null;
                    do {
                        var cachedItemsList = _this.computeCacheItemsList();
                        if (_this.cacheItemsItemList[_this.cacheItemsItemList.length - 1].bottom >= (_this.items.length * _this.itemHeight)) {
                            reachedBottom = true;
                        }
                        else {
                            index = _this.cacheItemsItemList[_this.cacheItemsItemList.length - 1].index + 1;
                            item = _this.items[index];
                        }
                        if (cachedItemsList[0].bottom >= options.scrollY)
                            allNodesHaveBeenMoved = true;
                        if (!reachedBottom && !allNodesHaveBeenMoved) {
                            _this.transformY(_this.cacheItemsItemList[0].node, (_this.numberOfRenderedItems * _this.itemHeight) + _this.getY(_this.cacheItemsItemList[0].node));
                            var scope = angular.element(_this.cacheItemsItemList[0].node).scope();
                            scope[_this.itemName] = item;
                            scope.$$index = index;
                            scope.$digest();
                        }
                    } while (!reachedBottom && !allNodesHaveBeenMoved);
                }
                if (_this.getScrollDirections(options.scrollY, options.lastScrollY) === VirtualIndexedListView.ScrollingDirection.Up) {
                    var reachedTop = false;
                    var allNodesHaveBeenMoved = false;
                    var item = null;
                    var index = null;
                    do {
                        var cachedItemsList = _this.computeCacheItemsList({ desc: true });
                        if (_this.cacheItemsItemList[_this.cacheItemsItemList.length - 1].top <= 0) {
                            reachedTop = true;
                        }
                        else {
                            index = _this.cacheItemsItemList[_this.cacheItemsItemList.length - 1].index - 1;
                            item = _this.items[index];
                        }
                        if (cachedItemsList[0].top <= options.scrollY + options.viewPortHeight)
                            allNodesHaveBeenMoved = true;
                        if (!reachedTop && !allNodesHaveBeenMoved) {
                            _this.transformY(_this.cacheItemsItemList[0].node, _this.getY(_this.cacheItemsItemList[0].node) - (_this.numberOfRenderedItems * _this.itemHeight));
                            var scope = angular.element(_this.cacheItemsItemList[0].node).scope();
                            scope[_this.itemName] = item;
                            scope.$$index = index;
                            scope.$digest();
                        }
                    } while (!reachedTop && !allNodesHaveBeenMoved);
                }
                if (_this.hasRendered && _this.getScrollDirections(options.scrollY, options.lastScrollY) === VirtualIndexedListView.ScrollingDirection.None) {
                    var cachedItemsList = _this.computeCacheItemsList();
                    var top = cachedItemsList[0].top;
                    var bottom = cachedItemsList[cachedItemsList.length - 1].bottom;
                    if (top > options.scrollY) {
                        console.log("missing items on top");
                    }
                    if (bottom < options.scrollY + options.viewPortHeight) {
                        console.log("missing items on bottom");
                        var reachedBottom = false;
                        var allNodesHaveBeenMoved = false;
                        var item = null;
                        var index = null;
                        do {
                            var cachedItemsList = _this.computeCacheItemsList();
                            if (_this.cacheItemsItemList[_this.cacheItemsItemList.length - 1].bottom >= (_this.items.length * _this.itemHeight)) {
                                reachedBottom = true;
                            }
                            else {
                                index = _this.cacheItemsItemList[_this.cacheItemsItemList.length - 1].index + 1;
                                item = _this.items[index];
                            }
                            if (cachedItemsList[0].bottom >= options.scrollY)
                                allNodesHaveBeenMoved = true;
                            if (!reachedBottom && !allNodesHaveBeenMoved) {
                                _this.transformY(_this.cacheItemsItemList[0].node, (_this.numberOfRenderedItems * _this.itemHeight) + _this.getY(_this.cacheItemsItemList[0].node));
                                var scope = angular.element(_this.cacheItemsItemList[0].node).scope();
                                scope[_this.itemName] = item;
                                scope.$$index = index;
                                scope.$digest();
                            }
                        } while (!reachedBottom && !allNodesHaveBeenMoved);
                    }
                }
                _this.hasRendered = true;
            };
            this.computeCacheItemsList = function (options) {
                _this.cacheItemsItemList = [];
                for (var i = 0; i < _this.renderedNodes.length; i++) {
                    var y = _this.getY(_this.renderedNodes[i]);
                    var offsetTop = _this.renderedNodes[i].offsetTop;
                    var itemHeight = _this.itemHeight;
                    _this.cacheItemsItemList.push({
                        top: y + offsetTop,
                        bottom: y + offsetTop + itemHeight,
                        index: angular.element(_this.renderedNodes[i]).scope().$$index,
                        node: _this.renderedNodes[i]
                    });
                }
                if (options && options.desc) {
                    _this.cacheItemsItemList.sort(function (a, b) {
                        return b.top - a.top;
                    });
                }
                else {
                    _this.cacheItemsItemList.sort(function (a, b) {
                        return a.top - b.top;
                    });
                }
                return _this.cacheItemsItemList;
            };
            this.cacheItemsItemList = [];
            this.getScrollDirections = function (scrollY, lastScrollY) {
                if (lastScrollY && scrollY > lastScrollY) {
                    return VirtualIndexedListView.ScrollingDirection.Down;
                }
                if (lastScrollY && scrollY < lastScrollY) {
                    return VirtualIndexedListView.ScrollingDirection.Up;
                }
                if (lastScrollY && scrollY === lastScrollY) {
                    return VirtualIndexedListView.ScrollingDirection.None;
                }
                return null;
            };
            this.hasRendered = false;
            this.lastYScroll = 0;
        }
        Object.defineProperty(VirtualIndexedListViewRenderer.prototype, "numberOfRenderedItems", {
            get: function () {
                if (!this._numberOfRenderedItems)
                    return Math.ceil(1380 / Number(this.itemHeight));
                return this._numberOfRenderedItems;
            },
            set: function (value) {
                this._numberOfRenderedItems = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VirtualIndexedListViewRenderer.prototype, "containerElement", {
            get: function () {
                if (!this._containerElement)
                    return this.element.find(".container");
                return this._containerElement;
            },
            set: function (value) {
                this._containerElement = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VirtualIndexedListViewRenderer.prototype, "renderedNodes", {
            get: function () {
                return this.containerElement[0].children;
            },
            enumerable: true,
            configurable: true
        });
        return VirtualIndexedListViewRenderer;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListViewRenderer", ["$compile", "$injector", "$interval", "virtualIndexedListView.getY", "virtualIndexedListView.transformY", VirtualIndexedListViewRenderer]);
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

//# sourceMappingURL=../functions/getHtml.js.map
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    VirtualIndexedListView.getY = function (element) {
        var transform = angular.element(element).css("transform");
        if (transform === "none") {
            return 0;
        }
        return JSON.parse(transform.replace(/^\w+\(/, "[").replace(/\)$/, "]"))[5];
    };
    angular.module("virtualIndexedListView").value("virtualIndexedListView.getY", VirtualIndexedListView.getY);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../functions/getY.js.map
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    VirtualIndexedListView.transformY = function (element, y) {
        angular.element(element).css({
            "-moz-transform": "translateY(" + y + "px)",
            "-webkit-transform": "translateY(" + y + "px)",
            "-ms-transform": "translateY(" + y + "px)",
            "-transform": "translateY(" + y + "px)"
        });
        return element;
    };
    angular.module("virtualIndexedListView").value("virtualIndexedListView.transformY", VirtualIndexedListView.transformY);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../functions/transformY.js.map