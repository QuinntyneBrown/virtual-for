/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    export class VirtualIndexedListView {

        constructor(private getHtml: IGetHtmlFn, private virtualIndexedListViewRenderer: IVirtualIndexedListViewRenderer ) { }

        public static createInstance = (getHtml: IGetHtmlFn, virtualIndexedListViewRenderer: IVirtualIndexedListViewRenderer) => {
            return new VirtualIndexedListView(getHtml, virtualIndexedListViewRenderer);
        }

        public restirct: string = "A";

        public transclude: string = 'element';

        public scope: any = false;

        public compile = (template: ng.IAugmentedJQuery) => {
            var virtualIndexedListViewRenderer: IVirtualIndexedListViewRenderer = this.virtualIndexedListViewRenderer;
            var parentElement = template.parent();
            var getHtml: IGetHtmlFn = this.getHtml;

            return function (scope: ng.IScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: any, transclude: any) {

                transclude(scope.$new(), (clone: ng.IAugmentedJQuery) => {

                    removeVirtualListCustomAttributes(clone);

                    virtualIndexedListViewRenderer.createInstance({
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

    angular.module("virtualIndexedListView").directive("virtualIndexedListView", ["virtualIndexedListView.getHtml","virtualIndexedListViewRenderer",VirtualIndexedListView.createInstance]);
}