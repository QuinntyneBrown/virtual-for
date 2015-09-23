/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    "use strict";
    var VirtualIndexedListViewRenderer = (function () {
        function VirtualIndexedListViewRenderer($compile, $injector, $interval, $timeout, getRenderedNodesComputedInfo, getScrollDirection, getY, observeOnScope, transformY) {
            var _this = this;
            this.$compile = $compile;
            this.$injector = $injector;
            this.$interval = $interval;
            this.$timeout = $timeout;
            this.getRenderedNodesComputedInfo = getRenderedNodesComputedInfo;
            this.getScrollDirection = getScrollDirection;
            this.getY = getY;
            this.observeOnScope = observeOnScope;
            this.transformY = transformY;
            this.createInstance = function (options) {
                var instance = new VirtualIndexedListViewRenderer(_this.$compile, _this.$injector, _this.$interval, _this.$timeout, _this.getRenderedNodesComputedInfo, _this.getScrollDirection, _this.getY, _this.observeOnScope, _this.transformY);
                instance.items = options.items;
                instance.itemName = options.itemName;
                instance.scope = options.scope;
                instance.element = options.element;
                instance.template = options.template;
                instance.itemHeight = Number(options.itemHeight);
                instance.viewPort = _this.$injector.get("virtualIndexedListView.viewPort").createInstance({ element: instance.element });
                instance.container = _this.$injector.get("virtualIndexedListView.container").createInstance({ element: instance.element });
                instance.container.setHeight(instance.items.length * instance.itemHeight);
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
                instance.observeOnScope(instance.scope, 'vm.filterTerm')
                    .map(function (data) {
                    return data;
                })
                    .subscribe(function (change) {
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
                _this.container.reInitialize({ height: _this.items.length * _this.itemHeight });
                _this.initialRender(options);
                try {
                    _this.scope.$digest();
                }
                catch (error) {
                }
            };
            this.initialRender = function (options) {
                for (var i = 0; i < _this.numberOfRenderedItems; i++) {
                    var childScope = _this.scope.$new(true);
                    childScope[_this.itemName] = _this.items[i];
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
                        item = _this.items[index];
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
                        item = _this.items[index];
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
                    console.log("missing items on top");
                }
                if (bottom <= options.scrollY + options.viewPortHeight) {
                    _this.renderDown(options);
                }
            };
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
        return VirtualIndexedListViewRenderer;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListViewRenderer", ["$compile",
        "$injector",
        "$interval",
        "$timeout",
        "virtualIndexedListView.getRenderedNodesComputedInfo",
        "virtualIndexedListView.getScrollDirection",
        "virtualIndexedListView.getY",
        "observeOnScope",
        "virtualIndexedListView.transformY", VirtualIndexedListViewRenderer]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/virtualIndexedListViewRenderer.js.map