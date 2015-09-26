/// <reference path="../typings/typescriptapp.d.ts" />
angular.module("virtualIndexedListView", []);

//# sourceMappingURL=virtualIndexedListView.module.js.map
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
    VirtualIndexedListView.getX = function (element) {
        var transform = angular.element(element).css("transform");
        if (transform === "none")
            return 0;
        return JSON.parse(transform.replace(/^\w+\(/, "[").replace(/\)$/, "]"))[6];
    };
    angular.module("virtualIndexedListView").value("virtualIndexedListView.getX", VirtualIndexedListView.getX);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../functions/getX.js.map
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    VirtualIndexedListView.getY = function (element) {
        var transform = angular.element(element).css("transform");
        if (transform === "none")
            return 0;
        return JSON.parse(transform.replace(/^\w+\(/, "[").replace(/\)$/, "]"))[5];
    };
    angular.module("virtualIndexedListView").value("virtualIndexedListView.getY", VirtualIndexedListView.getY);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../functions/getY.js.map
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    "use strict";
    var Injector = (function () {
        function Injector($injector) {
            var _this = this;
            this.$injector = $injector;
            this.get = function (options) {
                switch (options.interface) {
                    case "ICollectionManager":
                        if (options.filterFnNameOnVm && options.searchTermNameOnScope)
                            return _this.$injector.get("virtualIndexedListView.filterableCollectionManager").createInstance({ items: options.items, scope: options.scope, searchTermNameOnScope: options.searchTermNameOnScope, filterFnNameOnVm: options.filterFnNameOnVm });
                        if (options.dataService)
                            return _this.$injector.get("virtualIndexedListView.lazyLoadCollectionManager").createInstance({ items: options.items, dataService: options.dataService });
                        return _this.$injector.get("virtualIndexedListView.collectionManager").createInstance({ items: options.items });
                    case "IViewPort":
                        return _this.$injector.get("virtualIndexedListView.viewPort").createInstance({ element: options.element });
                    case "IContainer":
                        return _this.$injector.get("virtualIndexedListView.container").createInstance({ element: options.element });
                    case "IRenderedNodes":
                        return _this.$injector.get("virtualIndexedListView.renderedNodes").createInstance({ container: options.container });
                    case "IVirtualNodes":
                        return _this.$injector.get("virtualIndexedListView.virtualNodes").createInstance({ items: options.items, numberOfRenderedItems: options.numberOfRenderedItems, itemHeight: options.itemHeight });
                }
            };
        }
        return Injector;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListView.injector", ["$injector", Injector]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../functions/injector.js.map
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    VirtualIndexedListView.safeDigest = function (scope) {
        if (!scope.$$phase && !scope.$root.$$phase)
            scope.$digest();
    };
    angular.module("virtualIndexedListView").value("virtualIndexedListView.safeDigest", VirtualIndexedListView.safeDigest);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../functions/safeDigest.js.map
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
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView_1) {
    var VirtualIndexedListView = (function () {
        function VirtualIndexedListView(getHtml, virtualIndexedListViewRenderer) {
            var _this = this;
            this.getHtml = getHtml;
            this.virtualIndexedListViewRenderer = virtualIndexedListViewRenderer;
            this.restirct = "A";
            this.transclude = 'element';
            this.scope = false;
            this.compile = function (template) {
                var virtualIndexedListViewRenderer = _this.virtualIndexedListViewRenderer;
                var parentElement = template.parent();
                var getHtml = _this.getHtml;
                return function (scope, element, attributes, controller, transclude) {
                    transclude(scope.$new(), function (clone) {
                        removeVirtualListCustomAttributes(clone);
                        virtualIndexedListViewRenderer.createInstance({
                            element: angular.element(parentElement),
                            template: getHtml(clone[0], true),
                            scope: scope,
                            attributes: attributes,
                            items: attributes["virtualIndexedListViewItems"] ? JSON.parse(attributes["virtualIndexedListViewItems"]) : scope[attributes["virtualIndexedListViewCollectionName"]],
                            dataService: attributes["virtualIndexedListViewDataService"],
                            searchTermNameOnScope: attributes["virtualIndexedListViewSearchTermNameOnScope"],
                            filterFnNameOnVm: attributes["virtualIndexedListViewFilterFnNameOnVm"]
                        }).render({ lastScrollY: 0, scrollY: 0 });
                    });
                };
                function removeVirtualListCustomAttributes(clone) {
                    clone[0].removeAttribute("virtual-indexed-list-view");
                    clone[0].removeAttribute("virtual-indexed-list-view-collection-name");
                    clone[0].removeAttribute("virtual-indexed-list-view-item-name");
                    clone[0].removeAttribute("virtual-indexed-list-view-item-height");
                    clone[0].removeAttribute("virtual-indexed-list-view-items");
                    clone[0].removeAttribute("virtual-indexed-list-view-name");
                    clone[0].removeAttribute("virtual-indexed-list-view-data-service");
                    clone[0].removeAttribute("virtual-indexed-list-view-search-term-name-on-scope");
                    clone[0].removeAttribute("virtual-indexed-list-view-filter-fn-name-on-vm");
                }
            };
        }
        VirtualIndexedListView.createInstance = function (getHtml, virtualIndexedListViewRenderer) {
            return new VirtualIndexedListView(getHtml, virtualIndexedListViewRenderer);
        };
        return VirtualIndexedListView;
    })();
    VirtualIndexedListView_1.VirtualIndexedListView = VirtualIndexedListView;
    angular.module("virtualIndexedListView").directive("virtualIndexedListView", ["virtualIndexedListView.getHtml", "virtualIndexedListViewRenderer", VirtualIndexedListView.createInstance]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../directives/virtualIndexedListView.js.map
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var CollectionManager = (function () {
        function CollectionManager($q) {
            var _this = this;
            this.$q = $q;
            this.createInstance = function (options) {
                var instance = new CollectionManager(_this.$q);
                instance.items = options.items;
                instance.numberOfItems = options.items.length;
                return instance;
            };
            this.getIndexByCriteriaAsync = function (options) {
                var deferred = _this.$q.defer();
                var index = null;
                for (var i = 0; i < _this.items.length; i++) {
                    if (_this.items[i][options.criteria.key] == options.criteria.value)
                        index = i;
                }
                deferred.resolve({ index: index });
                return deferred.promise;
            };
            this.subscriptions = [];
            this.subscribe = function (options) {
                _this.subscriptions.push({
                    callback: options.callback,
                    id: _this.subscriptions.length + 1,
                    isActive: true
                });
                return _this.subscriptions.length;
            };
        }
        Object.defineProperty(CollectionManager.prototype, "numberOfItems", {
            get: function () { return this._numberOfItems; },
            set: function (value) { this._numberOfItems = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollectionManager.prototype, "items", {
            get: function () { return this._items; },
            set: function (value) { this._items = value; },
            enumerable: true,
            configurable: true
        });
        return CollectionManager;
    })();
    VirtualIndexedListView.CollectionManager = CollectionManager;
    angular.module("virtualIndexedListView").service("virtualIndexedListView.collectionManager", ["$q", CollectionManager]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/collectionManager.js.map
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var Container = (function () {
        function Container(getY) {
            var _this = this;
            this.getY = getY;
            this.createInstance = function (options) {
                var instance = new Container(_this.getY);
                var container = angular.element("<div class='container'></div>");
                options.element.append(container);
                instance.augmentedJQuery = options.element.find(".container");
                return instance;
            };
            this.reInitialize = function (options) {
                for (var i = 0; i < _this.htmlElement.children.length; i++) {
                    var oldScope = angular.element(_this.htmlElement.children[i]).scope();
                    oldScope.$destroy();
                }
                _this.htmlElement.innerHTML = "";
                _this.setHeight(options.height);
            };
            this.isNodeAtBottom = function (options) {
                var nodeBottom = _this.getY(options.node) + options.node.offsetTop + options.node.offsetTop;
                return nodeBottom === _this.height;
            };
            this.isNodeAtTop = function (options) {
                var nodeTop = _this.getY(options.node) + options.node.offsetTop;
                return nodeTop === _this.top;
            };
            this.setHeight = function (value) { _this.augmentedJQuery.css("height", value); };
        }
        Object.defineProperty(Container.prototype, "height", {
            get: function () { return this.htmlElement.offsetHeight; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "bottom", {
            get: function () { return this.htmlElement.offsetHeight + this.htmlElement.offsetTop; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "top", {
            get: function () { return this.htmlElement.offsetTop; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "augmentedJQuery", {
            get: function () { return this._augmentedJQuery; },
            set: function (value) { this._augmentedJQuery = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "htmlElement", {
            get: function () { return this.augmentedJQuery[0]; },
            enumerable: true,
            configurable: true
        });
        return Container;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListView.container", ["virtualIndexedListView.getY", Container]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/container.js.map
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var FilterableCollectionManager = (function () {
        function FilterableCollectionManager($q, $timeout) {
            var _this = this;
            this.$q = $q;
            this.$timeout = $timeout;
            this.createInstance = function (options) {
                var instance = new FilterableCollectionManager(_this.$q, _this.$timeout);
                instance.items = options.items;
                instance.numberOfItems = options.items.length;
                instance.filterFn = options.scope["vm"][options.filterFnNameOnVm];
                options.scope.$watch(options.searchTermNameOnScope, function (searchTerm) {
                    instance.searchTerm = searchTerm;
                    for (var i = 0; i < instance.subscriptions.length; i++) {
                        instance.subscriptions[i].callback();
                    }
                });
                return instance;
            };
            this.getIndexByCriteriaAsync = function (options) {
                var deferred = _this.$q.defer();
                var index = null;
                for (var i = 0; i < _this.items.length; i++) {
                    if (_this.items[i][options.criteria.key] == options.criteria.value) {
                        index = i;
                    }
                }
                deferred.resolve({ index: index });
                return deferred.promise;
            };
            this.subscriptions = [];
            this.subscribe = function (options) {
                _this.subscriptions.push({
                    callback: options.callback,
                    id: _this.subscriptions.length + 1,
                    isActive: true
                });
                return _this.subscriptions.length;
            };
        }
        Object.defineProperty(FilterableCollectionManager.prototype, "numberOfItems", {
            get: function () {
                return this._numberOfItems;
            },
            set: function (value) {
                this._numberOfItems = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FilterableCollectionManager.prototype, "items", {
            get: function () {
                var _this = this;
                if (this.searchTerm && this.searchTerm != "") {
                    return this._items.filter(function (item) {
                        return _this.filterFn(item, _this.searchTerm);
                    });
                }
                return this._items;
            },
            set: function (value) {
                this._items = value;
            },
            enumerable: true,
            configurable: true
        });
        return FilterableCollectionManager;
    })();
    VirtualIndexedListView.FilterableCollectionManager = FilterableCollectionManager;
    angular.module("virtualIndexedListView").service("virtualIndexedListView.filterableCollectionManager", ["$q", "$timeout", FilterableCollectionManager]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/filterableCollectionManager.js.map
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var LazyLoadCollectionManager = (function () {
        function LazyLoadCollectionManager($injector, $q) {
            var _this = this;
            this.$injector = $injector;
            this.$q = $q;
            this.createInstance = function (options) {
                var instance = new LazyLoadCollectionManager(_this.$injector, _this.$q);
                instance.items = options.items;
                instance.numberOfItems = options.items.length;
                instance.dataService = instance.$injector.get(options.dataService);
                instance.dataService.search({}).then(function (results) {
                    instance.numberOfItems = results.data.TotalHits;
                    for (var i = 0; i < results.data.TotalHits; i++) {
                        instance.items.push(null);
                    }
                    for (var i = 0; i < results.data.Data.length; i++) {
                        instance.items[i] = results.data.Data[i].Item;
                    }
                    for (var i = 0; i < instance.subscriptions.length; i++) {
                        instance.subscriptions[i].callback();
                    }
                });
                return instance;
            };
            this.getIndexByCriteriaAsync = function (options) {
                var deferred = _this.$q.defer();
                var index = null;
                for (var i = 0; i < _this.items.length; i++) {
                    if (_this.items[i][options.criteria.key] == options.criteria.value) {
                        index = i;
                    }
                }
                deferred.resolve({ index: index });
                return deferred.promise;
            };
            this.loadMore = function () {
                var lastLoadIndex = _this.lastLoadedIndex;
                if (!_this.loaded) {
                    _this.dataService.search({ params: { offset: lastLoadIndex, pageSize: _this.pageSize } }).then(function (results) {
                        for (var i = 0; i < results.data.Data.length; i++) {
                            _this.items[i + lastLoadIndex] = results.data.Data[i].Item;
                        }
                    });
                }
            };
            this.subscriptions = [];
            this.subscribe = function (options) {
                _this.subscriptions.push({
                    callback: options.callback,
                    id: _this.subscriptions.length + 1,
                    isActive: true
                });
                return _this.subscriptions.length;
            };
        }
        Object.defineProperty(LazyLoadCollectionManager.prototype, "loaded", {
            get: function () {
                var loaded = true;
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i] === null) {
                        loaded = false;
                        i = this.items.length;
                    }
                }
                return loaded;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LazyLoadCollectionManager.prototype, "lastLoadedIndex", {
            get: function () {
                var index = null;
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i] === null && index === null) {
                        index = i;
                        i = this.items.length;
                    }
                }
                return index;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LazyLoadCollectionManager.prototype, "pageSize", {
            get: function () {
                return 128;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LazyLoadCollectionManager.prototype, "numberOfItems", {
            get: function () { return this._numberOfItems; },
            set: function (value) { this._numberOfItems = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LazyLoadCollectionManager.prototype, "items", {
            get: function () { return this._items; },
            set: function (value) { this._items = value; },
            enumerable: true,
            configurable: true
        });
        return LazyLoadCollectionManager;
    })();
    VirtualIndexedListView.LazyLoadCollectionManager = LazyLoadCollectionManager;
    angular.module("virtualIndexedListView").service("virtualIndexedListView.lazyLoadCollectionManager", ["$injector", "$q", LazyLoadCollectionManager]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/lazyLoadCollectionManager.js.map
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var RenderedNode = (function () {
        function RenderedNode(getX, getY) {
            var _this = this;
            this.getX = getX;
            this.getY = getY;
            this.createInstance = function (options) {
                var instance = new RenderedNode(_this.getX, _this.getY);
                instance.node = options.node;
                return instance;
            };
        }
        Object.defineProperty(RenderedNode.prototype, "left", {
            get: function () {
                return this.getX(this.node) + this.node.offsetLeft;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderedNode.prototype, "right", {
            get: function () {
                return this.getX(this.node) + this.node.offsetLeft + this.node.offsetWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderedNode.prototype, "top", {
            get: function () {
                return this.getY(this.node) + this.node.offsetTop;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderedNode.prototype, "bottom", {
            get: function () {
                return this.getY(this.node) + this.node.offsetHeight + this.node.offsetTop;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderedNode.prototype, "scope", {
            get: function () {
                return angular.element(this.node).scope();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderedNode.prototype, "$$index", {
            get: function () {
                return this.scope.$$index;
            },
            enumerable: true,
            configurable: true
        });
        return RenderedNode;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListView.renderedNode", ["virtualIndexedListView.getX", "virtualIndexedListView.getY", RenderedNode]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/renderedNode.js.map
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var RenderedNodes = (function () {
        function RenderedNodes(getX, getY) {
            var _this = this;
            this.getX = getX;
            this.getY = getY;
            this.createInstance = function (options) {
                var instance = new RenderedNodes(_this.getX, _this.getY);
                instance.container = options.container;
                return instance;
            };
            this.getAll = function (options) {
                var direction;
                switch (options.orientation) {
                    case "horizontal":
                        direction = "left";
                        break;
                    default:
                        direction = "top";
                        break;
                }
                switch (options.order) {
                    case "desc":
                        return _this.map.sort(function (a, b) {
                            return b[direction] - a[direction];
                        });
                    case "asc":
                        return _this.map.sort(function (a, b) {
                            return a[direction] - b[direction];
                        });
                }
            };
            this.getHead = function () {
                var map = _this.getAll({ order: "asc" });
                if (map.length < 1) {
                    return null;
                }
                return map[0];
            };
            this.getTail = function () {
                var map = _this.getAll({ order: "desc" });
                if (map.length < 1) {
                    return null;
                }
                return map[0];
            };
            this.getHeadAndTail = function () {
                var map = _this.getAll({ order: "asc" });
                if (map.length < 1) {
                    return null;
                }
                return {
                    head: map[0],
                    tail: map[map.length - 1]
                };
            };
        }
        Object.defineProperty(RenderedNodes.prototype, "nodes", {
            get: function () {
                return this.container.htmlElement.childNodes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderedNodes.prototype, "map", {
            get: function () {
                var map = [];
                var nodes = this.nodes;
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    map.push({
                        top: this.getY(node) + node.offsetTop,
                        bottom: this.getY(node) + node.offsetTop + node.offsetHeight,
                        node: node
                    });
                }
                return map;
            },
            enumerable: true,
            configurable: true
        });
        return RenderedNodes;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListView.renderedNodes", ["virtualIndexedListView.getX", "virtualIndexedListView.getY", RenderedNodes]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/renderedNodes.js.map
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var ScopeCollectionManager = (function () {
        function ScopeCollectionManager($q) {
            var _this = this;
            this.$q = $q;
            this.createInstance = function (options) {
                var instance = new ScopeCollectionManager(_this.$q);
                instance.items = options.items;
                instance.numberOfItems = options.items.length;
                return instance;
            };
            this.getIndexByCriteriaAsync = function (options) {
                var deferred = _this.$q.defer();
                var index = null;
                for (var i = 0; i < _this.items.length; i++) {
                    if (_this.items[i][options.criteria.key] == options.criteria.value) {
                        index = i;
                    }
                }
                deferred.resolve({ index: index });
                return deferred.promise;
            };
            this.subscriptions = [];
            this.subscribe = function (options) {
                _this.subscriptions.push({
                    callback: options.callback,
                    id: _this.subscriptions.length + 1,
                    isActive: true
                });
                return _this.subscriptions.length;
            };
        }
        Object.defineProperty(ScopeCollectionManager.prototype, "numberOfItems", {
            get: function () { return this._numberOfItems; },
            set: function (value) { this._numberOfItems = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScopeCollectionManager.prototype, "items", {
            get: function () { return this._items; },
            set: function (value) { this._items = value; },
            enumerable: true,
            configurable: true
        });
        return ScopeCollectionManager;
    })();
    VirtualIndexedListView.ScopeCollectionManager = ScopeCollectionManager;
    angular.module("virtualIndexedListView").service("scopeCollectionManager", ["$q", ScopeCollectionManager]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/scopeCollectionManager.js.map
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var ViewPort = (function () {
        function ViewPort($window) {
            var _this = this;
            this.$window = $window;
            this.createInstance = function (options) {
                var instance = new ViewPort(_this.$window);
                instance.scrollableParentElement = instance.getScrollableParent(options.element[0]);
                return instance;
            };
            this.getScrollableParent = function (hTMLElement) {
                if (hTMLElement.tagName == "HTML")
                    return null;
                var scrollYCssValue = angular.element(hTMLElement).css("overflowY");
                if (scrollYCssValue == "scroll" || scrollYCssValue == "auto")
                    return angular.element(hTMLElement);
                if (hTMLElement.parentNode)
                    return _this.getScrollableParent(hTMLElement.parentNode);
            };
            this.scrollTo = function (value) {
                if (_this.scrollableParentElement) {
                    _this.scrollableParentElement[0].scrollTop = value;
                }
                else {
                    _this.$window.scrollTo(0, value);
                }
            };
        }
        Object.defineProperty(ViewPort.prototype, "scrollY", {
            get: function () {
                if (this.scrollableParentElement)
                    return this.scrollableParentElement[0].scrollTop;
                return this.$window.pageYOffset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewPort.prototype, "height", {
            get: function () {
                if (this.scrollableParentElement)
                    return this.scrollableParentElement[0].offsetHeight;
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
    "use strict";
    var VirtualIndexedListViewRenderer = (function () {
        function VirtualIndexedListViewRenderer($compile, $interval, getY, injector, safeDigest, transformY) {
            var _this = this;
            this.$compile = $compile;
            this.$interval = $interval;
            this.getY = getY;
            this.injector = injector;
            this.safeDigest = safeDigest;
            this.transformY = transformY;
            this.createInstance = function (options) {
                var instance = new VirtualIndexedListViewRenderer(_this.$compile, _this.$interval, _this.getY, _this.injector, _this.safeDigest, _this.transformY);
                instance.attributes = options.attributes;
                instance.scope = options.scope;
                instance.element = options.element;
                instance.template = options.template;
                instance.viewPort = _this.injector.get({ interface: "IViewPort", element: instance.element });
                instance.container = _this.injector.get({ interface: "IContainer", element: instance.element });
                instance.collectionManager = _this.injector.get({ interface: "ICollectionManager", element: instance.element, scope: options.scope, searchTermNameOnScope: options.searchTermNameOnScope, filterFnNameOnVm: options.filterFnNameOnVm, items: options.items, dataService: options.dataService, attributes: options.attributes });
                instance.renderedNodes = _this.injector.get({ interface: "IRenderedNodes", container: instance.container });
                if (instance.collectionManager instanceof VirtualIndexedListView.LazyLoadCollectionManager)
                    instance.$interval(instance.collectionManager.loadMore, 1000, null, false);
                instance.scope.$on(instance.scrollEventName, function (event, criteria) {
                    instance.collectionManager.getIndexByCriteriaAsync({ criteria: criteria }).then(function (result) {
                        instance.viewPort.scrollTo(result.index * instance.itemHeight);
                    });
                });
                instance.collectionManager.subscribe({ callback: instance.forceRender });
                instance.container.setHeight(instance.collectionManager.numberOfItems * instance.itemHeight);
                instance.$interval(function () {
                    instance.render({
                        scrollY: instance.viewPort.scrollY,
                        lastScrollY: instance.lastYScroll
                    });
                    instance.lastYScroll = instance.viewPort.scrollY;
                }, 10, null, false);
                instance.$interval(instance.onResize, 10, null, false);
                return instance;
            };
            this.render = function (options) {
                if (options.force)
                    return _this.forceRender();
                if (_this.hasRendered === false)
                    return _this.initialRender();
                if (options.lastScrollY && options.scrollY > options.lastScrollY)
                    return _this.renderDown(options);
                if (options.lastScrollY && options.scrollY < options.lastScrollY)
                    return _this.renderUp(options);
                if (options.lastScrollY && options.scrollY == options.lastScrollY)
                    return _this.stabilizeRender(options);
            };
            this.forceRender = function () {
                if (!_this.hasRendered)
                    return;
                _this.container.reInitialize({ height: _this.collectionManager.numberOfItems * _this.itemHeight });
                _this.initialRender();
                _this.safeDigest(_this.scope);
            };
            this.initialRender = function () {
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
                var digestNeeded = false;
                do {
                    var headAndTail = _this.renderedNodes.getHeadAndTail();
                    var tail = headAndTail.tail;
                    var head = headAndTail.head;
                    if (tail.bottom >= _this.container.bottom)
                        reachedBottom = true;
                    if (head.bottom >= options.scrollY)
                        allNodesHaveBeenMoved = true;
                    if (!reachedBottom && !allNodesHaveBeenMoved) {
                        var headY = _this.getY(head.node);
                        var tailY = _this.getY(tail.node);
                        var currentY = _this.container.top + headY + head.node.offsetTop;
                        var desiredY = _this.container.top + tailY + tail.node.offsetTop + _this.itemHeight;
                        var delta = (desiredY - currentY) + headY;
                        var index = angular.element(tail.node).scope().$$index;
                        _this.moveAndUpdateScope({
                            node: head.node,
                            position: delta,
                            index: index + 1,
                            item: _this.collectionManager.items[index + 1]
                        });
                        digestNeeded = true;
                    }
                } while (!reachedBottom && !allNodesHaveBeenMoved);
                if (digestNeeded)
                    _this.safeDigest(_this.scope);
            };
            this.moveAndUpdateScope = function (options) {
                _this.transformY(options.node, options.position);
                var scope = angular.element(options.node).scope();
                scope[_this.itemName] = options.item;
                scope.$$index = options.index;
            };
            this.renderUp = function (options) {
                var reachedTop = false;
                var allNodesHaveBeenMoved = false;
                var digestNeeded = false;
                do {
                    var headAndTail = _this.renderedNodes.getHeadAndTail();
                    var tail = headAndTail.tail;
                    var head = headAndTail.head;
                    if (tail.bottom <= _this.container.htmlElement.offsetTop + (_this.itemHeight * _this.numberOfRenderedItems))
                        reachedTop = true;
                    if (tail.top <= (_this.viewPort.scrollY + _this.viewPort.height))
                        allNodesHaveBeenMoved = true;
                    if (!reachedTop && !allNodesHaveBeenMoved) {
                        var headY = _this.getY(head.node);
                        var tailY = _this.getY(tail.node);
                        var currentY = _this.container.top + tailY + tail.node.offsetTop;
                        var desiredY = _this.container.top + headY + head.node.offsetTop - _this.itemHeight;
                        var delta = (desiredY - currentY) + tailY;
                        var index = angular.element(head.node).scope().$$index;
                        _this.moveAndUpdateScope({
                            node: tail.node,
                            position: delta,
                            index: index - 1,
                            item: _this.collectionManager.items[index - 1]
                        });
                        digestNeeded = true;
                    }
                } while (!reachedTop && !allNodesHaveBeenMoved);
                if (digestNeeded)
                    _this.safeDigest(_this.scope);
            };
            this.stabilizeRender = function (options) {
                var headAndTail = _this.renderedNodes.getHeadAndTail();
                if (headAndTail.head.top > options.scrollY)
                    _this.renderUp(options);
                if (headAndTail.tail.bottom <= options.scrollY + _this.viewPort.height)
                    _this.renderDown(options);
            };
            this.onResize = function () {
                if (!_this.maxViewPortHeight)
                    _this.maxViewPortHeight = _this.viewPort.height;
                if (_this.maxViewPortHeight && _this.maxViewPortHeight < _this.viewPort.height) {
                    _this.maxViewPortHeight = _this.viewPort.height;
                    var renderedNodesLength = _this.renderedNodes.getAll({ order: "asc" }).length;
                    while (_this.numberOfRenderedItems > renderedNodesLength) {
                        var tail = _this.renderedNodes.getHeadAndTail().tail;
                        var index = angular.element(tail.node).scope().$$index + 1;
                        var childScope = _this.scope.$new(true);
                        childScope[_this.itemName] = _this.collectionManager.items[index];
                        childScope.$$index = index;
                        var itemContent = _this.$compile(angular.element(_this.template))(childScope);
                        _this.container.augmentedJQuery.append(itemContent);
                        var element = itemContent[0];
                        var headY = _this.getY(element);
                        var tailY = _this.getY(tail.node);
                        var currentY = _this.container.top + headY + element.offsetTop;
                        var desiredY = _this.container.top + tailY + tail.node.offsetTop + _this.itemHeight;
                        var delta = (desiredY - currentY) + headY;
                        _this.transformY(element, delta);
                        renderedNodesLength++;
                    }
                    _this.safeDigest(_this.scope);
                }
            };
            this.hasRendered = false;
            this.lastYScroll = 0;
        }
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
        Object.defineProperty(VirtualIndexedListViewRenderer.prototype, "itemName", {
            get: function () { return this.attributes[this.controlPrefix + "ItemName"]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VirtualIndexedListViewRenderer.prototype, "itemHeight", {
            get: function () { return Number(this.attributes[this.controlPrefix + "ItemHeight"]); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VirtualIndexedListViewRenderer.prototype, "name", {
            get: function () { return this.attributes[this.controlPrefix + "Name"]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VirtualIndexedListViewRenderer.prototype, "scrollEventName", {
            get: function () { return this.controlPrefix + "Scroll" + this.name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VirtualIndexedListViewRenderer.prototype, "controlPrefix", {
            get: function () { return "virtualIndexedListView"; },
            enumerable: true,
            configurable: true
        });
        return VirtualIndexedListViewRenderer;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListViewRenderer", ["$compile",
        "$interval",
        "virtualIndexedListView.getY",
        "virtualIndexedListView.injector",
        "virtualIndexedListView.safeDigest",
        "virtualIndexedListView.transformY",
        VirtualIndexedListViewRenderer]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/virtualIndexedListViewRenderer.js.map
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var VirtualNodes = (function () {
        function VirtualNodes() {
            var _this = this;
            this.createInstance = function (options) {
                var instance = new VirtualNodes();
                instance.numberOfRenderedItems = options.numberOfRenderedItems;
                instance.items = options.items;
                instance.numberOfItems = options.numberOfItems;
                instance.itemHeight = options.itemHeight;
                return instance;
            };
            this.getYByRenderedIndexAndScrollY = function (options) {
                var y = null;
                for (var i = 0; i < _this.map.length; i++) {
                    var map = _this.map[i];
                    if (map.renderedNodeIndex == options.renderedNodeIndex && options.scrollY <= map.maxScrollYThreshold) {
                        if (y == null)
                            y = map.y;
                    }
                }
                return y;
            };
            this.getPageIndex = function (options) {
                return Math.floor(options.index / _this.numberOfRenderedItems);
            };
        }
        Object.defineProperty(VirtualNodes.prototype, "map", {
            get: function () {
                var map = [];
                var renderedNodeIndex = 0;
                for (var i = 0; i < this.items.length; i++) {
                    var pageIndex = this.getPageIndex({ index: i });
                    var minScrollYThreshold = this.itemHeight + ((pageIndex) * this.itemHeight);
                    map.push({
                        index: i,
                        y: (pageIndex) * (this.numberOfRenderedItems * this.itemHeight),
                        renderedNodeIndex: renderedNodeIndex,
                        pageIndex: pageIndex,
                        maxScrollYThreshold: ((pageIndex + 1) * this.itemHeight) + (this.itemHeight * renderedNodeIndex)
                    });
                    renderedNodeIndex++;
                    if (renderedNodeIndex == this.numberOfRenderedItems)
                        renderedNodeIndex = 0;
                }
                return map;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VirtualNodes.prototype, "pages", {
            get: function () {
                return Math.ceil(this.numberOfItems / this.numberOfRenderedItems);
            },
            enumerable: true,
            configurable: true
        });
        return VirtualNodes;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListView.virtualNodes", [VirtualNodes]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/virtualNodes.js.map