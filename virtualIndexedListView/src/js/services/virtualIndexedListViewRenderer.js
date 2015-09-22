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