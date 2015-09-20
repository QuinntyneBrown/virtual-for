/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    class VirtualIndexedListViewManager implements IVirtualIndexedListManager {

        constructor() {

        }

        public createInstance = (options: any) => {
            var instance = new VirtualIndexedListViewManager();

            return instance;
        }

        public render = () => {
            
        }

    }

    angular.module("virtualIndexedListView").service("virtualIndexedListViewManager", [VirtualIndexedListViewManager]);
}

