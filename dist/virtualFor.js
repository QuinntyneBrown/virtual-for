/// <reference path="../typings/typescriptapp.d.ts" />
angular.module("virtualFor", []);

//# sourceMappingURL=virtualFor.module.js.map

/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualFor;
(function (VirtualFor_1) {
    var VirtualFor = (function () {
        function VirtualFor(getHtml, renderer) {
            var _this = this;
            this.getHtml = getHtml;
            this.renderer = renderer;
            this.restirct = "A";
            this.transclude = 'element';
            this.scope = false;
            this.compile = function (template) {
                var renderer = _this.renderer;
                var parentElement = template.parent();
                var getHtml = _this.getHtml;
                return function (scope, element, attributes, controller, transclude) {
                    transclude(scope.$new(), function (clone) {
                        removeCustomAttributes(clone, "virtual-for");
                        renderer.createInstance({
                            element: angular.element(parentElement),
                            template: getHtml(clone[0], true),
                            scope: scope,
                            attributes: attributes,
                            items: parseItems(scope, attributes),
                            dataService: attributes["virtualForDataService"],
                            searchTermNameOnScope: attributes["virtualForSearchTermNameOnScope"],
                            filterFnNameOnVm: attributes["virtualForFilterFnNameOnVm"]
                        }).render({ lastScrollY: 0, scrollY: 0 });
                    });
                };
                function parseItems(scope, attributes) {
                    var match = attributes["virtualFor"].match(/^\s*(.+)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/);
                    if (match) {
                        var collectionStringArray = match[2].split(".");
                        var items = scope;
                        for (var i = 0; i < collectionStringArray.length; i++) {
                            items = items[collectionStringArray[i]];
                        }
                        return items;
                    }
                    else {
                        return JSON.parse(attributes["virtualFor"]);
                    }
                }
                function removeCustomAttributes(clone, prefix) {
                    var names = [];
                    var attributes = clone[0].attributes;
                    for (var i = 0; i < attributes.length; i++) {
                        if (attributes[i].nodeName.indexOf(prefix) > -1)
                            names.push(attributes[i].nodeName);
                    }
                    names.forEach(function (name) { clone[0].removeAttribute(name); });
                }
                function verifyRepeatExpression(repeatExpression) {
                    if (repeatExpression.match(/limitTo/) || repeatExpression.match(/startFrom/)) {
                        throw new Error('"limitTo" and "startFrom" filters are not allowed in directive');
                    }
                }
                ;
            };
        }
        VirtualFor.createInstance = function (getHtml, renderer) {
            return new VirtualFor(getHtml, renderer);
        };
        return VirtualFor;
    })();
    VirtualFor_1.VirtualFor = VirtualFor;
    angular.module("virtualFor").directive("virtualFor", ["virtualFor.getHtml", "virtualFor.renderer", VirtualFor.createInstance]);
})(VirtualFor || (VirtualFor = {}));

//# sourceMappingURL=virtualFor.js.map

/// <reference path="../../typings/typescriptapp.d.ts" />
angular.module("virtualFor").value("virtualFor.compileExpression", compileExpression);

//# sourceMappingURL=compileExpression.js.map

/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualFor;
(function (VirtualFor) {
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
    angular.module("virtualFor").value("virtualFor.getHtml", getHtml);
})(VirtualFor || (VirtualFor = {}));

//# sourceMappingURL=getHtml.js.map

/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualFor;
(function (VirtualFor) {
    VirtualFor.getX = function (element) {
        var transform = angular.element(element).css("transform");
        if (transform === "none")
            return 0;
        return JSON.parse(transform.replace(/^\w+\(/, "[").replace(/\)$/, "]"))[6];
    };
    angular.module("virtualFor").value("virtualFor.getX", VirtualFor.getX);
})(VirtualFor || (VirtualFor = {}));

//# sourceMappingURL=getX.js.map

/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualFor;
(function (VirtualFor) {
    VirtualFor.getY = function (element) {
        var transform = angular.element(element).css("transform");
        if (transform === "none")
            return 0;
        return JSON.parse(transform.replace(/^\w+\(/, "[").replace(/\)$/, "]"))[5];
    };
    angular.module("virtualFor").value("virtualFor.getY", VirtualFor.getY);
})(VirtualFor || (VirtualFor = {}));

//# sourceMappingURL=getY.js.map

/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualFor;
(function (VirtualFor) {
    "use strict";
    var Injector = (function () {
        function Injector($injector) {
            var _this = this;
            this.$injector = $injector;
            this.get = function (options) {
                switch (options.interfaceName) {
                    case "ICollectionManager":
                        if (options.filterFnNameOnVm && options.searchTermNameOnScope)
                            return _this.$injector.get("virtualFor.filterableCollectionManager").createInstance({ items: options.items, scope: options.scope, searchTermNameOnScope: options.searchTermNameOnScope, filterFnNameOnVm: options.filterFnNameOnVm });
                        if (options.dataService)
                            return _this.$injector.get("virtualFor.lazyLoadCollectionManager").createInstance({ items: options.items, dataService: options.dataService });
                        return _this.$injector.get("virtualFor.collectionManager").createInstance({ items: options.items });
                    case "IViewPort":
                        return _this.$injector.get("virtualFor.viewPort").createInstance({ element: options.element });
                    case "IContainer":
                        return _this.$injector.get("virtualFor.container").createInstance({ element: options.element });
                    case "IRenderedNodes":
                        return _this.$injector.get("virtualFor.renderedNodes").createInstance({ container: options.container });
                    case "IVirtualNodes":
                        return _this.$injector.get("virtualFor.virtualNodes").createInstance({ items: options.items, numberOfRenderedItems: options.numberOfRenderedItems, itemHeight: options.itemHeight });
                }
            };
        }
        return Injector;
    })();
    angular.module("virtualFor").service("virtualFor.injector", ["$injector", Injector]);
})(VirtualFor || (VirtualFor = {}));

//# sourceMappingURL=injector.js.map

/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualFor;
(function (VirtualFor) {
    VirtualFor.safeDigest = function (scope) {
        if (!scope.$$phase && !scope.$root.$$phase)
            scope.$digest();
    };
    angular.module("virtualFor").value("virtualFor.safeDigest", VirtualFor.safeDigest);
})(VirtualFor || (VirtualFor = {}));

//# sourceMappingURL=safeDigest.js.map

/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualFor;
(function (VirtualFor) {
    VirtualFor.transformY = function (element, y) {
        angular.element(element).css({
            "-moz-transform": "translateY(" + y + "px)",
            "-webkit-transform": "translateY(" + y + "px)",
            "-ms-transform": "translateY(" + y + "px)",
            "-transform": "translateY(" + y + "px)"
        });
        return element;
    };
    angular.module("virtualFor").value("virtualFor.transformY", VirtualFor.transformY);
})(VirtualFor || (VirtualFor = {}));

//# sourceMappingURL=transformY.js.map

/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualFor;
(function (VirtualFor) {
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
    VirtualFor.CollectionManager = CollectionManager;
    angular.module("virtualFor").service("virtualFor.collectionManager", ["$q", CollectionManager]);
})(VirtualFor || (VirtualFor = {}));

//# sourceMappingURL=collectionManager.js.map

/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualFor;
(function (VirtualFor) {
    var Container = (function () {
        function Container(getY) {
            var _this = this;
            this.getY = getY;
            this.createInstance = function (options) {
                var instance = new Container(_this.getY);
                var container = angular.element("<div class='container'></div>");
                container[0].style.padding = "0";
                container[0].style.margin = "0";
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
    angular.module("virtualFor").service("virtualFor.container", ["virtualFor.getY", Container]);
})(VirtualFor || (VirtualFor = {}));

//# sourceMappingURL=container.js.map

/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualFor;
(function (VirtualFor) {
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
    VirtualFor.FilterableCollectionManager = FilterableCollectionManager;
    angular.module("virtualFor").service("virtualFor.filterableCollectionManager", ["$q", "$timeout", FilterableCollectionManager]);
})(VirtualFor || (VirtualFor = {}));

//# sourceMappingURL=filterableCollectionManager.js.map

/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualFor;
(function (VirtualFor) {
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
    VirtualFor.LazyLoadCollectionManager = LazyLoadCollectionManager;
    angular.module("virtualFor").service("virtualFor.lazyLoadCollectionManager", ["$injector", "$q", LazyLoadCollectionManager]);
})(VirtualFor || (VirtualFor = {}));

//# sourceMappingURL=lazyLoadCollectionManager.js.map

/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualFor;
(function (VirtualFor) {
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
    angular.module("virtualFor").service("virtualFor.renderedNode", ["virtualFor.getX", "virtualFor.getY", RenderedNode]);
})(VirtualFor || (VirtualFor = {}));

//# sourceMappingURL=renderedNode.js.map

/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualFor;
(function (VirtualFor) {
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
    angular.module("virtualFor").service("virtualFor.renderedNodes", ["virtualFor.getX", "virtualFor.getY", RenderedNodes]);
})(VirtualFor || (VirtualFor = {}));

//# sourceMappingURL=renderedNodes.js.map

/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualFor;
(function (VirtualFor) {
    "use strict";
    var Renderer = (function () {
        function Renderer($compile, $interval, $$rAF, getY, injector, safeDigest, transformY) {
            var _this = this;
            this.$compile = $compile;
            this.$interval = $interval;
            this.$$rAF = $$rAF;
            this.getY = getY;
            this.injector = injector;
            this.safeDigest = safeDigest;
            this.transformY = transformY;
            this.createInstance = function (options) {
                var instance = new Renderer(_this.$compile, _this.$interval, _this.$$rAF, _this.getY, _this.injector, _this.safeDigest, _this.transformY);
                instance.attributes = options.attributes;
                instance.scope = options.scope;
                instance.element = options.element;
                instance.template = options.template;
                instance.viewPort = _this.injector.get({ interfaceName: "IViewPort", element: instance.element });
                instance.container = _this.injector.get({ interfaceName: "IContainer", element: instance.element });
                instance.collectionManager = _this.injector.get({
                    interfaceName: "ICollectionManager",
                    element: instance.element,
                    scope: options.scope,
                    searchTermNameOnScope: options.searchTermNameOnScope,
                    filterFnNameOnVm: options.filterFnNameOnVm,
                    items: options.items,
                    dataService: options.dataService,
                    attributes: options.attributes
                });
                instance.renderedNodes = _this.injector.get({ interfaceName: "IRenderedNodes", container: instance.container });
                if (instance.collectionManager instanceof VirtualFor.LazyLoadCollectionManager)
                    instance.$interval(instance.collectionManager.loadMore, 1000, null, false);
                instance.scope.$on(instance.scrollEventName, instance.onScrollTo);
                instance.scope.$on(instance.removeItemEventName, instance.renderRemoveItem);
                instance.collectionManager.subscribe({ callback: instance.forceRender });
                instance.container.setHeight(instance.collectionManager.numberOfItems * instance.itemHeight);
                instance.$interval(instance.render, 1, null, false);
                instance.$interval(instance.onResize, 10, null, false);
                return instance;
            };
            this.onScrollTo = function (event, criteria) {
                _this.collectionManager.getIndexByCriteriaAsync({ criteria: criteria }).then(function (result) {
                    _this.viewPort.scrollTo(result.index * _this.itemHeight);
                });
            };
            this.render = function (options) {
                if (options && options.force)
                    return _this.forceRender();
                if (_this.hasRendered === false)
                    return _this.initialRender();
                if (_this.viewPort.scrollY > _this.lastScrollY)
                    return _this.renderTopToBottom();
                if (_this.viewPort.scrollY < _this.lastScrollY)
                    return _this.renderBottomToTop();
            };
            this.forceRender = function () {
                if (!_this.hasRendered)
                    return;
                _this.container.reInitialize({ height: _this.collectionManager.numberOfItems * _this.itemHeight });
                _this.initialRender();
                _this.safeDigest(_this.scope);
            };
            this.initialRender = function () {
                var fragment = document.createDocumentFragment();
                for (var i = 0; i < _this.numberOfRenderedItems; i++) {
                    var childScope = _this.scope.$new(true);
                    childScope[_this.itemName] = _this.collectionManager.items[i];
                    childScope.$$index = i;
                    var itemContent = _this.$compile(angular.element(_this.template))(childScope);
                    fragment.appendChild(itemContent[0]);
                }
                _this.container.augmentedJQuery[0].appendChild(fragment);
                _this.hasRendered = true;
            };
            this.renderTopToBottom = function () {
                console.log(_this.calculateScrollBottomDiff());
                var reachedBottom = false;
                var allNodesHaveBeenMoved = false;
                var digestNeeded = false;
                do {
                    var headAndTail = _this.renderedNodes.getHeadAndTail();
                    var tail = headAndTail.tail;
                    var head = headAndTail.head;
                    if (angular.element(tail.node).scope().$$index == _this.collectionManager.numberOfItems - 1)
                        reachedBottom = true;
                    if (head.bottom >= _this.viewPort.scrollY)
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
                _this.lastScrollY = _this.viewPort.scrollY;
            };
            this.renderBottomToTop = function () {
                console.log(_this.calculateScrollBottomDiff());
                var reachedTop = false;
                var allNodesHaveBeenMoved = false;
                var digestNeeded = false;
                do {
                    var headAndTail = _this.renderedNodes.getHeadAndTail();
                    var tail = headAndTail.tail;
                    var head = headAndTail.head;
                    if (angular.element(head.node).scope().$$index == 0)
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
                _this.lastScrollY = _this.viewPort.scrollY;
            };
            this.renderRemoveItem = function (event, options) {
                var renderNodes = _this.renderedNodes.getAll({ order: "asc" });
                var scope = null;
                _this.collectionManager.items.splice(options.index, 1);
                _this.collectionManager.numberOfItems = _this.collectionManager.numberOfItems - 1;
                for (var i = 0; i < renderNodes.length; i++) {
                    scope = angular.element(renderNodes[i].node).scope();
                    scope[_this.itemName] = _this.collectionManager.items[scope.$$index];
                }
                if (renderNodes.length > _this.collectionManager.numberOfItems) {
                    angular.element(renderNodes[renderNodes.length - 1].node).scope().$destroy();
                    _this.container.htmlElement.removeChild(renderNodes[renderNodes.length - 1].node);
                    _this.container.setHeight(renderNodes.length * _this.itemHeight);
                }
                else {
                    _this.container.setHeight(_this.collectionManager.numberOfItems * _this.itemHeight);
                }
                _this.safeDigest(_this.scope);
            };
            this.moveAndUpdateScope = function (options) {
                _this.transformY(options.node, options.position);
                var scope = angular.element(options.node).scope();
                scope[_this.itemName] = options.item;
                scope.$$index = options.index;
            };
            this.calculateScrollBottomDiff = function () {
                return _this.container.top;
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
            this.calculateItemHeight = function (options) {
                var itemHeight;
                if (options.items.length > 0) {
                    var childScope = _this.scope.$new(true);
                    childScope[_this.itemName] = options.items[0];
                    var itemContent = _this.$compile(angular.element(_this.template))(childScope);
                    _this.container.augmentedJQuery.append(itemContent);
                    itemHeight = itemContent[0].offsetHeight;
                    _this.container.htmlElement.removeChild(itemContent[0]);
                }
                return itemHeight;
            };
            this.lastScrollY = 0;
        }
        Object.defineProperty(Renderer.prototype, "numberOfRenderedItems", {
            get: function () {
                if (this.collectionManager.numberOfItems < this.max)
                    return this.collectionManager.numberOfItems;
                return this.max;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "max", {
            get: function () {
                return Math.ceil(((this.viewPort.height * this.renderPageSize) + this.container.htmlElement.offsetTop) / Number(this.itemHeight));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "itemName", {
            get: function () { return this.attributes[this.controlPrefix + "Of"]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "itemHeight", {
            get: function () {
                if (!this._itemHeight && this.collectionManager.items.length > 0)
                    this._itemHeight = this.calculateItemHeight({ items: this.collectionManager.items });
                if (!this._itemHeight)
                    return Number(this.attributes[this.controlPrefix + "ItemHeight"]);
                return this._itemHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "renderPageSize", {
            get: function () { return 1; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "name", {
            get: function () { return this.attributes[this.controlPrefix + "Name"]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "scrollEventName", {
            get: function () { return this.controlPrefix + "Scroll" + this.name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "removeItemEventName", {
            get: function () { return this.controlPrefix + "RemoveItem" + this.name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "controlPrefix", {
            get: function () { return "virtualFor"; },
            enumerable: true,
            configurable: true
        });
        return Renderer;
    })();
    VirtualFor.Renderer = Renderer;
    angular.module("virtualFor").service("virtualFor.renderer", ["$compile",
        "$interval",
        "$$rAF",
        "virtualFor.getY",
        "virtualFor.injector",
        "virtualFor.safeDigest",
        "virtualFor.transformY",
        Renderer]);
})(VirtualFor || (VirtualFor = {}));

//# sourceMappingURL=renderer.js.map

/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualFor;
(function (VirtualFor) {
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
    VirtualFor.ScopeCollectionManager = ScopeCollectionManager;
    angular.module("virtualFor").service("scopeCollectionManager", ["$q", ScopeCollectionManager]);
})(VirtualFor || (VirtualFor = {}));

//# sourceMappingURL=scopeCollectionManager.js.map

/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualFor;
(function (VirtualFor) {
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
        Object.defineProperty(ViewPort.prototype, "windowElement", {
            get: function () { return angular.element(this.$window); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewPort.prototype, "scrollY", {
            get: function () {
                if (this.scrollableParentElement)
                    return this.scrollableParentElement[0].scrollTop;
                return this.windowElement.scrollTop();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewPort.prototype, "height", {
            get: function () {
                if (this.scrollableParentElement) {
                    return this.scrollableParentElement[0].offsetHeight;
                }
                return this.windowElement.height();
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
    VirtualFor.ViewPort = ViewPort;
    angular.module("virtualFor").service("virtualFor.viewPort", ["$window", ViewPort]);
})(VirtualFor || (VirtualFor = {}));

//# sourceMappingURL=viewPort.js.map

/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualFor;
(function (VirtualFor) {
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
    angular.module("virtualFor").service("virtualFor.virtualNodes", [VirtualNodes]);
})(VirtualFor || (VirtualFor = {}));

//# sourceMappingURL=virtualNodes.js.map
