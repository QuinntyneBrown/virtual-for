/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualFor {

    export class VirtualFor {

        constructor(private getHtml: IGetHtmlFn, private renderer: IRenderer ) { }

        public static createInstance = (getHtml: IGetHtmlFn, renderer: IRenderer) => {
            return new VirtualFor(getHtml, renderer);
        }

        public restirct: string = "A";
        public transclude: string = 'element';
        public scope: any = false;

        public compile = (template: ng.IAugmentedJQuery) => {
            var renderer: IRenderer = this.renderer;
            var parentElement = template.parent();
            var getHtml: IGetHtmlFn = this.getHtml;

            return  (scope: ng.IScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: any, transclude: any) => {
                transclude(scope.$new(), (clone: ng.IAugmentedJQuery) => {
                    removeVirtualListCustomAttributes(clone);

                    var items = scope["vm"][attributes["virtualFor"]];

                    if (!items)
                        items = JSON.parse(attributes["virtualFor"]);

                    renderer.createInstance({
                        element: angular.element(parentElement),
                        template: getHtml(clone[0], true),
                        scope: scope,
                        attributes: attributes,
                        items: items,
                        dataService: attributes["virtualForDataService"],
                        searchTermNameOnScope: attributes["virtualForSearchTermNameOnScope"],
                        filterFnNameOnVm: attributes["virtualForFilterFnNameOnVm"]
                    }).render({ lastScrollY: 0, scrollY: 0 });
                });
            }

            function removeVirtualListCustomAttributes(clone: ng.IAugmentedJQuery) {
                var names = [];

                for (var i = 0; i < clone[0].attributes.length; i++) {
                    if (clone[0].attributes[i].nodeName.indexOf("virtual-for") > -1)
                        names.push(clone[0].attributes[i].nodeName);
                }

                for (var i = 0; i < names.length; i++) {
                    clone[0].removeAttribute(names[i]);
                }
            }
        }

    }

    angular.module("virtualFor").directive("virtualFor", ["virtualFor.getHtml","virtualFor.renderer",VirtualFor.createInstance]);
}