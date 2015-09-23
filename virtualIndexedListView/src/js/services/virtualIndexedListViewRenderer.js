/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    "use strict";
    var VirtualIndexedListViewRenderer = (function () {
        function VirtualIndexedListViewRenderer($compile, $injector, $interval, getRenderedNodesComputedInfo, getScrollDirection, getY, observeOnScope, transformY) {
            var _this = this;
            this.$compile = $compile;
            this.$injector = $injector;
            this.$interval = $interval;
            this.getRenderedNodesComputedInfo = getRenderedNodesComputedInfo;
            this.getScrollDirection = getScrollDirection;
            this.getY = getY;
            this.observeOnScope = observeOnScope;
            this.transformY = transformY;
            this.createInstance = function (options) {
                var instance = new VirtualIndexedListViewRenderer(_this.$compile, _this.$injector, _this.$interval, _this.getRenderedNodesComputedInfo, _this.getScrollDirection, _this.getY, _this.observeOnScope, _this.transformY);
                instance.itemName = options.itemName;
                instance.scope = options.scope;
                instance.element = options.element;
                instance.template = options.template;
                instance.itemHeight = Number(options.itemHeight);
                instance.viewPort = _this.$injector.get("virtualIndexedListView.viewPort").createInstance({ element: instance.element });
                instance.container = _this.$injector.get("virtualIndexedListView.container").createInstance({ element: instance.element });
                if (options.filterFn && options.searchTermNameOnScope) {
                    instance.collectionManager = _this.$injector.get("virtualIndexedListView.filterableCollectionManager").createInstance({ items: options.items });
                }
                else {
                    instance.collectionManager = _this.$injector.get("virtualIndexedListView.collectionManager").createInstance({ items: options.items });
                }
                instance.scope.$on(instance.scrollEventName, function (criteria) {
                    instance.collectionManager.getIndexByCriteriaAsync({ criteria: criteria }).then(function (result) {
                        instance.viewPort.scrollTo(result.index * instance.itemHeight);
                    });
                });
                instance.collectionManager.subscribe({
                    callback: function () {
                        instance.forceRender({
                            viewPortHeight: instance.viewPort.height
                        });
                    }
                });
                instance.container.setHeight(instance.collectionManager.numberOfItems * instance.itemHeight);
                instance.$interval(function () {
                    instance.render({
                        scrollY: instance.viewPort.scrollY,
                        lastScrollY: instance.lastYScroll,
                        viewPortHeight: instance.viewPort.height
                    });
                    instance.lastYScroll = instance.viewPort.scrollY;
                }, 10, null, false);
                return instance;
            };
            this.render = function (options) {
                if (!options) {
                    options = {
                        lastScrollY: 0,
                        scrollY: 0,
                        viewPortHeight: _this.viewPort.height
                    };
                }
                if (options.force) {
                    _this.forceRender(options);
                    return;
                }
                if (_this.hasRendered === false) {
                    _this.initialRender(options);
                }
                if (_this.getScrollDirection(options.scrollY, options.lastScrollY) === VirtualIndexedListView.ScrollingDirection.Down) {
                    _this.renderDown(options);
                    return;
                }
                if (_this.getScrollDirection(options.scrollY, options.lastScrollY) === VirtualIndexedListView.ScrollingDirection.Up) {
                    _this.renderUp(options);
                    return;
                }
                if (_this.getScrollDirection(options.scrollY, options.lastScrollY) === VirtualIndexedListView.ScrollingDirection.None) {
                    _this.stabilizeRender(options);
                    return;
                }
            };
            this.forceRender = function (options) {
                if (!_this.hasRendered)
                    return;
                _this.container.reInitialize({ height: _this.collectionManager.numberOfItems * _this.itemHeight });
                _this.initialRender(options);
                if (!_this.scope.$$phase && !_this.scope.$root.$$phase)
                    _this.scope.$digest();
            };
            this.initialRender = function (options) {
                for (var i = 0; i < _this.numberOfRenderedItems; i++) {
                    var childScope = _this.scope.$new(true);
                    childScope[_this.itemName] = _this.collectionManager.items[i];
                    childScope.$$index = i;
                    var itemContent = _this.$compile(angular.element(_this.template))(childScope);
                    _this.container.augmentedJQuery.append(itemContent);
                }
                _this.hasRendered = true;
            };
            this.renderDown = function (options) {
                var reachedBottom = false;
                var allNodesHaveBeenMoved = false;
                var item = null;
                var index = null;
                do {
                    var cachedItemsList = _this.getRenderedNodesComputedInfo({ getY: _this.getY, renderedNodes: _this.container.htmlElement.children, itemHeight: _this.itemHeight, desc: false });
                    if (cachedItemsList[cachedItemsList.length - 1].bottom >= _this.container.bottom) {
                        reachedBottom = true;
                    }
                    else {
                        index = cachedItemsList[cachedItemsList.length - 1].index + 1;
                        item = _this.collectionManager.items[index];
                    }
                    if (cachedItemsList[0].bottom >= options.scrollY)
                        allNodesHaveBeenMoved = true;
                    if (!reachedBottom && !allNodesHaveBeenMoved) {
                        _this.transformY(cachedItemsList[0].node, (_this.numberOfRenderedItems * _this.itemHeight) + _this.getY(cachedItemsList[0].node));
                        var scope = angular.element(cachedItemsList[0].node).scope();
                        scope[_this.itemName] = item;
                        scope.$$index = index;
                        scope.$digest();
                    }
                } while (!reachedBottom && !allNodesHaveBeenMoved);
            };
            this.renderUp = function (options) {
                var reachedTop = false;
                var allNodesHaveBeenMoved = false;
                var item = null;
                var index = null;
                do {
                    var cachedItemsList = _this.getRenderedNodesComputedInfo({ getY: _this.getY, renderedNodes: _this.container.htmlElement.children, itemHeight: _this.itemHeight, desc: true });
                    if (cachedItemsList[cachedItemsList.length - 1].top <= 0) {
                        reachedTop = true;
                    }
                    else {
                        index = cachedItemsList[cachedItemsList.length - 1].index - 1;
                        item = _this.collectionManager.items[index];
                    }
                    if (cachedItemsList[0].top <= options.scrollY + options.viewPortHeight)
                        allNodesHaveBeenMoved = true;
                    if (!reachedTop && !allNodesHaveBeenMoved) {
                        _this.transformY(cachedItemsList[0].node, _this.getY(cachedItemsList[0].node) - (_this.numberOfRenderedItems * _this.itemHeight));
                        var scope = angular.element(cachedItemsList[0].node).scope();
                        scope[_this.itemName] = item;
                        scope.$$index = index;
                        scope.$digest();
                    }
                } while (!reachedTop && !allNodesHaveBeenMoved);
            };
            this.stabilizeRender = function (options) {
                var cachedItemsList = _this.getRenderedNodesComputedInfo({ getY: _this.getY, renderedNodes: _this.container.htmlElement.children, itemHeight: _this.itemHeight, desc: false });
                var top = cachedItemsList[0].top;
                var bottom = cachedItemsList[cachedItemsList.length - 1].bottom;
                if (top > options.scrollY) {
                    _this.renderUp(options);
                }
                if (bottom <= options.scrollY + options.viewPortHeight) {
                    _this.renderDown(options);
                }
            };
            this.hasRendered = false;
            this.lastYScroll = 0;
        }
        Object.defineProperty(VirtualIndexedListViewRenderer.prototype, "scrollEventName", {
            get: function () {
                return "virtualIndexedListView" + this.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VirtualIndexedListViewRenderer.prototype, "numberOfRenderedItems", {
            get: function () {
                var max = Math.ceil(1380 / Number(this.itemHeight));
                if (this.collectionManager.numberOfItems < max)
                    return this.collectionManager.numberOfItems;
                return max;
            },
            enumerable: true,
            configurable: true
        });
        return VirtualIndexedListViewRenderer;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListViewRenderer", ["$compile",
        "$injector",
        "$interval",
        "virtualIndexedListView.getRenderedNodesComputedInfo",
        "virtualIndexedListView.getScrollDirection",
        "virtualIndexedListView.getY",
        "observeOnScope",
        "virtualIndexedListView.transformY", VirtualIndexedListViewRenderer]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/virtualIndexedListViewRenderer.js.map