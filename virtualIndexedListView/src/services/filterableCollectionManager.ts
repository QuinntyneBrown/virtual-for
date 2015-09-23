/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    class FilterableCollectionManager implements IFilterableCollectionManager {
        constructor(private $q:ng.IQService, private $timeout:ng.ITimeoutService,private observeOnScope: any) { }

        public createInstance = (options: IFilterableCollectionManagerInstanceOptions) => {
            var instance = new FilterableCollectionManager(this.$q,this.$timeout, this.observeOnScope);
            instance.items = options.items;
            instance.numberOfItems = options.items.length;

            var timeoutPromise = null;

            instance.observeOnScope(options.scope, options.searchTermNameOnScope)
                .map(function (data) {
                    return data;
                })
                .subscribe(function (change) {

                if (change.oldValue != change.newValue) {
                    options.filterFn = (value: any) => {
                        return value.name.indexOf(change.newValue) > -1;
                    }

                    if (timeoutPromise)
                        instance.$timeout.cancel(timeoutPromise);

                    timeoutPromise = instance.$timeout(() => {
                        for (var i = 0; i < instance.subscriptions.length; i++) {
                            instance.subscriptions[i].callback();
                        }
                    }, 10, false);
                }
            });
            return instance;
        }

        public getIndexByCriteriaAsync = (options: any) => {

            var deferred = this.$q.defer();

            deferred.resolve(true);

            return deferred.promise;
        } 

        public scope: any;

        private _numberOfItems: number;

        public get numberOfItems() {
            return this._numberOfItems;
        }

        public set numberOfItems(value: number) {
            this._numberOfItems = value;
        }

        private _items: any[];

        public get items() {
            return this._items;
        }

        public set items(value: any[]) {
            this._items = value;
        }

        public subscriptions: ISubscription[] = [];

        public subscribe = (options: ISubscribeOptions) => {
            this.subscriptions.push({
                callback: options.callback,
                id: this.subscriptions.length + 1,
                isActive: true
            });
            return this.subscriptions.length;
        }
    }

    angular.module("virtualIndexedListView").service("virtualIndexedListView.filterableCollectionManager", ["$q", "$timeout","observeOnScope",FilterableCollectionManager]);
} 