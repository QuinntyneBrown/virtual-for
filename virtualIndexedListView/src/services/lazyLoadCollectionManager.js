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
            get: function () {
                return this._numberOfItems;
            },
            set: function (value) {
                this._numberOfItems = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LazyLoadCollectionManager.prototype, "items", {
            get: function () {
                return this._items;
            },
            set: function (value) {
                this._items = value;
            },
            enumerable: true,
            configurable: true
        });
        return LazyLoadCollectionManager;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListView.lazyLoadCollectionManager", ["$injector", "$q", LazyLoadCollectionManager]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));
//# sourceMappingURL=lazyLoadCollectionManager.js.map