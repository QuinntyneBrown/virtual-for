/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    export class VirtualIndexedListView {
        constructor(private getHtml: any, private virtualIndexedListManager: IVirtualIndexedListManager ) { }

        public static createInstance = (getHtml: any, virtualIndexedListManager: IVirtualIndexedListManager) => {
            return new VirtualIndexedListView(getHtml, virtualIndexedListManager);
        }

        public restirct: string = "A";

        public transclude: string = 'element';

        public scope: any = false;

        public compile = (template: ng.IAugmentedJQuery) => {
            var virtualIndexedListManager: IVirtualIndexedListManager = this.virtualIndexedListManager;
            var parentElement = template.parent();
            var getHTML = this.getHtml;

            return function (scope: ng.IScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: any, transclude: any) {

                transclude(scope.$new(), function (clone: ng.IAugmentedJQuery) {

                    removeVirtualListCustomAttributes(clone);

                    virtualIndexedListManager.createInstance({
                        element: angular.element(parentElement),
                        template: getHTML(clone[0], true),
                        scope: scope,
                        items: scope[attributes["virtualIndexedListViewCollectionName"]],
                        itemName: attributes["virtualIndexedListViewItemName"],
                        itemHeight: attributes["virtualIndexedListViewItemHeight"],
                        window: window
                    }).render();

                });

            }

            function removeVirtualListCustomAttributes(clone: ng.IAugmentedJQuery) {
                clone[0].removeAttribute("virtual-indexed-list-view");
                clone[0].removeAttribute("virtual-indexed-list-view-collection-name");
                clone[0].removeAttribute("virtual-indexed-list-view-item-name");
                clone[0].removeAttribute("virtual-indexed-list-view-item-height");
            }
        }

    }

    angular.module("virtualIndexedListView").directive("virtualIndexedListView", ["getHtml","virtualIndexedListManager",VirtualIndexedListView.createInstance]);
}