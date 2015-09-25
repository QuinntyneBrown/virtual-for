/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    "use strict";
    var VirtualIndexedListViewRenderer = (function () {
        function VirtualIndexedListViewRenderer($compile, $interval, getScrollDirection, getY, injector, transformY) {
            var _this = this;
            this.$compile = $compile;
            this.$interval = $interval;
            this.getScrollDirection = getScrollDirection;
            this.getY = getY;
            this.injector = injector;
            this.transformY = transformY;
            this.createInstance = function (options) {
                var instance = new VirtualIndexedListViewRenderer(_this.$compile, _this.$interval, _this.getScrollDirection, _this.getY, _this.injector, _this.transformY);
                instance.itemName = options.itemName;
                instance.scope = options.scope;
                instance.element = options.element;
                instance.template = options.template;
                instance.itemHeight = Number(options.itemHeight);
                instance.name = options.name;
                instance.viewPort = _this.injector.get({ interface: "IViewPort", element: instance.element });
                instance.container = _this.injector.get({ interface: "IContainer", element: instance.element });
                instance.collectionManager = _this.injector.get({ interface: "ICollectionManager", element: instance.element, scope: options.scope, searchTermNameOnScope: options.searchTermNameOnScope, filterFnNameOnVm: options.filterFnNameOnVm, items: options.items, dataService: options.dataService });
                instance.renderedNodes = _this.injector.get({ interface: "IRenderedNodes", container: instance.container });
                if (instance.collectionManager.type == VirtualIndexedListView.collectionType.lazyLoad) {
                    instance.$interval(function () {
                        instance.collectionManager.loadMore();
                    }, 1000, null, false);
                }
                instance.scope.$on(instance.scrollEventName, function (event, criteria) {
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
                do {
                    var headAndTail = _this.renderedNodes.getHeadAndTail();
                    var tail = headAndTail.tail;
                    var head = headAndTail.head;
                    if (tail.bottom >= _this.container.bottom)
                        reachedBottom = true;
                    if (head.bottom >= options.scrollY)
                        allNodesHaveBeenMoved = true;
                    if (!reachedBottom && !allNodesHaveBeenMoved)
                        _this.moveAndUpdateScope({
                            node: head.node,
                            position: (_this.numberOfRenderedItems * _this.itemHeight) + _this.getY(head.node),
                            index: tail.index + 1,
                            item: _this.collectionManager.items[tail.index + 1]
                        });
                } while (!reachedBottom && !allNodesHaveBeenMoved);
            };
            this.moveAndUpdateScope = function (options) {
                _this.transformY(options.node, options.position);
                var scope = angular.element(options.node).scope();
                scope[_this.itemName] = options.item;
                scope.$$index = options.index;
                scope.$digest();
            };
            this.renderUp = function (options) {
                var reachedTop = false;
                var allNodesHaveBeenMoved = false;
                do {
                    var headAndTail = _this.renderedNodes.getHeadAndTail();
                    var tail = headAndTail.tail;
                    var head = headAndTail.head;
                    if (tail.bottom <= _this.container.htmlElement.offsetTop + (_this.itemHeight * _this.numberOfRenderedItems))
                        reachedTop = true;
                    if (tail.top <= (_this.viewPort.scrollY + _this.viewPort.height))
                        allNodesHaveBeenMoved = true;
                    if (!reachedTop && !allNodesHaveBeenMoved)
                        _this.moveAndUpdateScope({
                            node: tail.node,
                            position: _this.getY(tail.node) - (_this.numberOfRenderedItems * _this.itemHeight),
                            index: head.index - 1,
                            item: _this.collectionManager.items[head.index - 1]
                        });
                } while (!reachedTop && !allNodesHaveBeenMoved);
            };
            this.stabilizeRender = function (options) {
                var headAndTail = _this.renderedNodes.getHeadAndTail();
                var top = headAndTail.head.top;
                var bottom = headAndTail.tail.bottom;
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
                return "virtualIndexedListViewScroll" + this.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VirtualIndexedListViewRenderer.prototype, "numberOfRenderedItems", {
            get: function () {
                var max = Math.ceil((this.viewPort.height + this.container.htmlElement.offsetTop) / Number(this.itemHeight));
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
        "$interval",
        "virtualIndexedListView.getScrollDirection",
        "virtualIndexedListView.getY",
        "virtualIndexedListView.injector",
        "virtualIndexedListView.transformY", VirtualIndexedListViewRenderer]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/virtualIndexedListViewRenderer.js.map