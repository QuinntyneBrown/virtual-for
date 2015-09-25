/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    "use strict";

    class Injector implements IInjector {

        constructor(private $injector: ng.auto.IInjectorService) {
            
        }

        public get = (options: any):any => {
            
            switch(options.interface) {
            
                case "ICollectionManager":
                    if (options.filterFnNameOnVm && options.searchTermNameOnScope) {
                        return (<IFilterableCollectionManager>this.$injector.get("virtualIndexedListView.filterableCollectionManager")).createInstance({ items: options.items, scope: options.scope, searchTermNameOnScope: options.searchTermNameOnScope, filterFnNameOnVm: options.filterFnNameOnVm });
                    } else if (options.dataService) {
                        return (<ILazyLoadCollectionManager>this.$injector.get("virtualIndexedListView.lazyLoadCollectionManager")).createInstance({ items: options.items, dataService: options.dataService });
                    } else {
                        return (<ICollectionManager>this.$injector.get("virtualIndexedListView.collectionManager")).createInstance({ items: options.items });
                    }

                case "IViewPort":
                    return (<IViewPort>this.$injector.get("virtualIndexedListView.viewPort")).createInstance({ element: options.element });

                case "IContainer":
                    return (<IContainer>this.$injector.get("virtualIndexedListView.container")).createInstance({ element: options.element });

                case "IRenderedNodes":
                    return (<IRenderedNodes>this.$injector.get("virtualIndexedListView.renderedNodes")).createInstance({ container: options.container });


            }

        }
    }

    angular.module("virtualIndexedListView").service("virtualIndexedListView.injector", ["$injector",Injector]);
}