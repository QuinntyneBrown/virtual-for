/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualFor {

    "use strict";

    class Injector implements IInjector {

        constructor(private $injector: ng.auto.IInjectorService) { }

        public get = (options: any):any => {
            
            switch (options.interfaceName) {
            
                case "ICollectionManager":
                    if (options.filterFnNameOnVm && options.searchTermNameOnScope) return (<IFilterableCollectionManager>this.$injector.get("virtualFor.filterableCollectionManager")).createInstance({ items: options.items, scope: options.scope, searchTermNameOnScope: options.searchTermNameOnScope, filterFnNameOnVm: options.filterFnNameOnVm });
                    if (options.dataService) return (<ILazyLoadCollectionManager>this.$injector.get("virtualFor.lazyLoadCollectionManager")).createInstance({ items: options.items, dataService: options.dataService });                    
                    return (<ICollectionManager>this.$injector.get("virtualFor.collectionManager")).createInstance({ items: options.items });

                case "IViewPort":
                    return (<IViewPort>this.$injector.get("virtualFor.viewPort")).createInstance({ element: options.element });

                case "IContainer":
                    return (<IContainer>this.$injector.get("virtualFor.container")).createInstance({ element: options.element });

                case "IRenderedNodes":
                    return (<IRenderedNodes>this.$injector.get("virtualFor.renderedNodes")).createInstance({ container: options.container });

                case "IVirtualNodes":
                    return (<IRenderedNodes>this.$injector.get("virtualFor.virtualNodes")).createInstance({ items: options.items, numberOfRenderedItems: options.numberOfRenderedItems, itemHeight: options.itemHeight });

            }

        }
    }

    angular.module("virtualFor").service("virtualFor.injector", ["$injector",Injector]);
}