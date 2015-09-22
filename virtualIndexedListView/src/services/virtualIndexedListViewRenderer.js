/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    "use strict";
    var VirtualIndexedListViewRenderer = (function () {
        function VirtualIndexedListViewRenderer($compile, $injector, $interval, $timeout, getScrollDirection, getY, observeOnScope, transformY) {
            var _this = this;
            this.$compile = $compile;
            this.$injector = $injector;
            this.$interval = $interval;
            this.$timeout = $timeout;
            this.getScrollDirection = getScrollDirection;
            this.getY = getY;
            this.observeOnScope = observeOnScope;
            this.transformY = transformY;
            this.createInstance = function (options) {
                var instance = new VirtualIndexedListViewRenderer(_this.$compile, _this.$injector, _this.$interval, _this.$timeout, _this.getScrollDirection, _this.getY, _this.observeOnScope, _this.transformY);
                instance.items = options.items;
                instance.itemName = options.itemName;
                instance.scope = options.scope;
                instance.element = options.element;
                instance.template = options.template;
                instance.itemHeight = Number(options.itemHeight);
                instance.viewPort = _this.$injector.get("virtualIndexedListView.viewPort").createInstance({ element: instance.element });
                if (instance.numberOfRenderedItems > instance.items.length)
                    instance.numberOfRenderedItems = instance.items.length;
                instance.$interval(function () {
                    instance.render({
                        scrollY: instance.viewPort.scrollY,
                        lastScrollY: instance.lastYScroll,
                        viewPortHeight: instance.viewPort.height
                    });
                    instance.lastYScroll = instance.viewPort.scrollY;
                }, 10, null, false);
                var timeoutPromise = null;
                instance.observeOnScope(instance.scope, 'vm.filterTerm').map(function (data) {
                    return data;
                }).subscribe(function (change) {
                    instance.filterTerm.observedChange = change;
                    instance.filterTerm.newValue = change.newValue;
                    instance.filterTerm.oldValue = change.oldValue;
                    instance.filterFn = function (value) {
                        return value.name.indexOf(instance.filterTerm.newValue) > -1;
                    };
                    if (timeoutPromise)
                        instance.$timeout.cancel(timeoutPromise);
                    timeoutPromise = instance.$timeout(function () {
                        instance.render({ force: true, lastScrollY: 0, scrollY: 0, viewPortHeight: instance.viewPort.height });
                    }, 10, false);
                });
                instance.filterFn = instance.scope.filterFn;
                return instance;
            };
            this._filterTerm = {};
            this.render = function (options) {
                if (!options) {
                    options = {
                        lastScrollY: 0,
                        scrollY: 0,
                        viewPortHeight: _this.viewPort.height
                    };
                }
                var containerElement;
                if (options.force) {
                    var container = _this.containerElement[0];
                    for (var i = 0; i < container.children.length; i++) {
                        var oldScope = angular.element(container.children[i]).scope();
                        oldScope.$destroy();
                    }
                    container.innerHTML = "";
                    angular.element(container).css("height", _this.containerHeight);
                    for (var i = 0; i < _this.numberOfRenderedItems; i++) {
                        var childScope = _this.scope.$new(true);
                        childScope[_this.itemName] = _this.items[i];
                        childScope.$$index = i;
                        var itemContent = _this.$compile(angular.element(_this.template))(childScope);
                        angular.element(container).append(itemContent);
                    }
                    try {
                        _this.scope.$digest();
                    }
                    catch (error) {
                    }
                    _this.hasRendered = true;
                }
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
                    var cachedItemsList = _this.computeCacheItemsList();
                    try {
                        _this.scope.$digest();
                    }
                    catch (error) {
                    }
                }
                if (_this.getScrollDirection(options.scrollY, options.lastScrollY) === 1 /* Down */) {
                    var reachedBottom = false;
                    var allNodesHaveBeenMoved = false;
                    var item = null;
                    var index = null;
                    do {
                        var cachedItemsList = _this.computeCacheItemsList();
                        if (cachedItemsList[_this.cacheItemsItemList.length - 1].bottom >= _this.containerBottom) {
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
                if (_this.getScrollDirection(options.scrollY, options.lastScrollY) === 0 /* Up */) {
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
                if (_this.hasRendered && _this.getScrollDirection(options.scrollY, options.lastScrollY) === 2 /* None */) {
                    var cachedItemsList = _this.computeCacheItemsList();
                    var top = cachedItemsList[0].top;
                    var bottom = cachedItemsList[cachedItemsList.length - 1].bottom;
                    if (top > options.scrollY) {
                        console.log("missing items on top");
                    }
                    if (bottom <= options.scrollY + options.viewPortHeight) {
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
            this.hasRendered = false;
            this.lastYScroll = 0;
        }
        Object.defineProperty(VirtualIndexedListViewRenderer.prototype, "filterTerm", {
            get: function () {
                return this._filterTerm;
            },
            set: function (value) {
                this._filterTerm = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VirtualIndexedListViewRenderer.prototype, "containerHeight", {
            get: function () {
                return this.items.length * this.itemHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VirtualIndexedListViewRenderer.prototype, "items", {
            get: function () {
                if (this.filterFn && this.filterTerm.newValue)
                    return this._items.filter(this.filterFn);
                return this._items;
            },
            set: function (value) {
                this._items = value;
            },
            enumerable: true,
            configurable: true
        });
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
        Object.defineProperty(VirtualIndexedListViewRenderer.prototype, "containerBottom", {
            get: function () {
                return this.containerElement[0].offsetHeight + this.containerElement[0].offsetTop;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VirtualIndexedListViewRenderer.prototype, "containerTop", {
            get: function () {
                return this.containerElement[0].offsetTop;
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
    angular.module("virtualIndexedListView").service("virtualIndexedListViewRenderer", ["$compile", "$injector", "$interval", "$timeout", "virtualIndexedListView.getScrollDirection", "virtualIndexedListView.getY", "observeOnScope", "virtualIndexedListView.transformY", VirtualIndexedListViewRenderer]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));
//# sourceMappingURL=virtualIndexedListViewRenderer.js.map