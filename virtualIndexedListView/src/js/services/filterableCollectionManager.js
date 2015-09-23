/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var FilterableCollectionManager = (function () {
        function FilterableCollectionManager($q, $timeout, observeOnScope) {
            var _this = this;
            this.$q = $q;
            this.$timeout = $timeout;
            this.observeOnScope = observeOnScope;
            this.createInstance = function (options) {
                var instance = new FilterableCollectionManager(_this.$q, _this.$timeout, _this.observeOnScope);
                instance.items = options.items;
                instance.numberOfItems = options.items.length;
                var timeoutPromise = null;
                instance.observeOnScope(options.scope, options.searchTermNameOnScope)
                    .map(function (data) {
                    return data;
                })
                    .subscribe(function (change) {
                    if (change.oldValue != change.newValue) {
                        options.filterFn = function (value) {
                            return value.name.indexOf(change.newValue) > -1;
                        };
                        if (timeoutPromise)
                            instance.$timeout.cancel(timeoutPromise);
                        timeoutPromise = instance.$timeout(function () {
                            for (var i = 0; i < instance.subscriptions.length; i++) {
                                instance.subscriptions[i].callback();
                            }
                        }, 10, false);
                    }
                });
                return instance;
            };
            this.getIndexByCriteriaAsync = function (options) {
                var deferred = _this.$q.defer();
                deferred.resolve(true);
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
    angular.module("virtualIndexedListView").service("virtualIndexedListView.filterableCollectionManager", ["$q", "$timeout", "observeOnScope", FilterableCollectionManager]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/filterableCollectionManager.js.map