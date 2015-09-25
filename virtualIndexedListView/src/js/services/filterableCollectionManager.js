/// <reference path="../../typings/typescriptapp.d.ts" />
/// <reference path="../enums/collectiontype.ts" />
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
            this.type = VirtualIndexedListView.collectionType.filterable;
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
    //class FilterableCollectionManager implements IFilterableCollectionManager {
    //    constructor(private $q:ng.IQService, private $timeout:ng.ITimeoutService,private observeOnScope: any) { }
    //    public createInstance = (options: IFilterableCollectionManagerInstanceOptions) => {
    //        var instance = new FilterableCollectionManager(this.$q,this.$timeout, this.observeOnScope);
    //        instance.items = options.items;
    //        instance.numberOfItems = options.items.length;
    //        var timeoutPromise = null;
    //        instance.observeOnScope(options.scope, options.searchTermNameOnScope)
    //            .map(function (data) {
    //                return data;
    //            })
    //            .subscribe(function (change) {
    //            if (change.oldValue != change.newValue) {
    //                if (timeoutPromise)
    //                    instance.$timeout.cancel(timeoutPromise);
    //                timeoutPromise = instance.$timeout(() => {
    //                    for (var i = 0; i < instance.subscriptions.length; i++) {
    //                        instance.subscriptions[i].callback();
    //                    }
    //                }, 10, false);
    //            }
    //        });
    //        return instance;
    //    }
    //    public getIndexByCriteriaAsync = (options: any) => {
    //        var deferred = this.$q.defer();
    //        deferred.resolve(true);
    //        return deferred.promise;
    //    } 
    //    public scope: any;
    //    private _numberOfItems: number;
    //    public get numberOfItems() {
    //        return this._numberOfItems;
    //    }
    //    public set numberOfItems(value: number) {
    //        this._numberOfItems = value;
    //    }
    //    private _items: any[];
    //    public get items() {
    //        return this._items;
    //    }
    //    public set items(value: any[]) {
    //        this._items = value;
    //    }
    //    public subscriptions: ISubscription[] = [];
    //    public subscribe = (options: ISubscribeOptions) => {
    //        this.subscriptions.push({
    //            callback: options.callback,
    //            id: this.subscriptions.length + 1,
    //            isActive: true
    //        });
    //        return this.subscriptions.length;
    //    }
    //}
    angular.module("virtualIndexedListView").service("virtualIndexedListView.filterableCollectionManager", ["$q", "$timeout", FilterableCollectionManager]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/filterableCollectionManager.js.map