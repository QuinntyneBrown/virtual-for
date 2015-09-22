/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    export class VirtualIndexedListView {

        constructor(private getHtml: IGetHtmlFn, private virtualIndexedListViewManager: IVirtualIndexedListViewManager ) { }

        public static createInstance = (getHtml: IGetHtmlFn, virtualIndexedListViewManager: IVirtualIndexedListViewManager) => {
            return new VirtualIndexedListView(getHtml, virtualIndexedListViewManager);
        }

        public restirct: string = "A";

        public transclude: string = 'element';

        public scope: any = false;

        public compile = (template: ng.IAugmentedJQuery) => {
            var virtualIndexedListViewManager: IVirtualIndexedListViewManager = this.virtualIndexedListViewManager;
            var parentElement = template.parent();
            var getHtml: IGetHtmlFn = this.getHtml;

            return function (scope: ng.IScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: any, transclude: any) {

                transclude(scope.$new(),  (clone: ng.IAugmentedJQuery) => {

                    removeVirtualListCustomAttributes(clone);

                    virtualIndexedListViewManager.createInstance({
                        element: angular.element(parentElement),
                        template: getHtml(clone[0], true),
                        scope: scope,
                        items: attributes["virtualIndexedListViewItems"] ? JSON.parse(attributes["virtualIndexedListViewItems"]) : scope[attributes["virtualIndexedListViewCollectionName"]],
                        itemName: attributes["virtualIndexedListViewItemName"],
                        itemHeight: attributes["virtualIndexedListViewItemHeight"]
                    }).render();

                });
            }

            function removeVirtualListCustomAttributes(clone: ng.IAugmentedJQuery) {
                clone[0].removeAttribute("virtual-indexed-list-view");
                clone[0].removeAttribute("virtual-indexed-list-view-collection-name");
                clone[0].removeAttribute("virtual-indexed-list-view-item-name");
                clone[0].removeAttribute("virtual-indexed-list-view-item-height");
                clone[0].removeAttribute("virtual-indexed-list-view-items");
            }
        }

    }

    angular.module("virtualIndexedListView").directive("virtualIndexedListView", ["virtualIndexedListView.getHtml","virtualIndexedListViewManager",VirtualIndexedListView.createInstance]);
}