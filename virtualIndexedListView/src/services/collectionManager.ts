/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    class CollectionManager implements ICollectionManager {
        constructor(private $q:ng.IQService) {

        }

        public createInstance = (options: ICollectionManagerInstanceOptions) => {
            var instance = new CollectionManager(this.$q);
            instance.items = options.items;
            instance.numberOfItems = options.items.length;
            return instance;
        }

        public getIndexByCriteriaAsync = (options: any) => {

            var deferred = this.$q.defer();

            deferred.resolve(true);

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

    angular.module("virtualIndexedListView").service("virtualIndexedListView.collectionManager", ["$q",CollectionManager]);
} 