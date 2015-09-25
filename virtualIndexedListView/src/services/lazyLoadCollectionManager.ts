/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    class LazyLoadCollectionManager implements ICollectionManager {
        constructor(private $injector:ng.auto.IInjectorService, private $q: ng.IQService) {
            
        }

        public type: collectionType = collectionType.lazyLoad;

        public createInstance = (options: ILazyLoadCollectionManagerInstanceOptions) => {            
            var instance = new LazyLoadCollectionManager(this.$injector,this.$q);
            instance.items = options.items;
            instance.numberOfItems = options.items.length;            
            instance.dataService = instance.$injector.get(options.dataService);
            instance.dataService.search({}).then((results: any) => {
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
        }

        public get loaded() {
            var loaded = true;

            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i] === null) {
                    loaded = false;
                    i = this.items.length;
                }
            }
            return loaded;
        }

        public get lastLoadedIndex() {
            var index = null;

            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i] === null && index === null) {
                    index = i;
                    i = this.items.length;
                }
            }
            return index;
        }

        public get pageSize() {
            return 128;
        }

        public dataService: any;

        public getIndexByCriteriaAsync = (options: any) => {

            var deferred = this.$q.defer();

            var index = null;

            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i][options.criteria.key] == options.criteria.value) {
                    index = i;
                }
            }

            deferred.resolve({ index: index });

            return deferred.promise;
        }

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

        public loadMore = () => {
            var lastLoadIndex = this.lastLoadedIndex;

            if (!this.loaded) {
                this.dataService.search({ params: { offset: lastLoadIndex, pageSize : this.pageSize } }).then((results:any) => {
                    for (var i = 0; i < results.data.Data.length; i++) {
                        this.items[i + lastLoadIndex] = results.data.Data[i].Item;
                    }
                });
            }
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

    angular.module("virtualIndexedListView").service("virtualIndexedListView.lazyLoadCollectionManager", ["$injector","$q", LazyLoadCollectionManager]);
} 