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
                    removeCustomAttributes(clone, "virtual-for");

                    renderer.createInstance({
                        element: angular.element(parentElement),
                        template: getHtml(clone[0], true),
                        scope: scope,
                        attributes: attributes,
                        items: parseItems(scope,attributes),
                        dataService: attributes["virtualForDataService"],
                        searchTermNameOnScope: attributes["virtualForSearchTermNameOnScope"],
                        filterFnNameOnVm: attributes["virtualForFilterFnNameOnVm"]
                    }).render({ lastScrollY: 0, scrollY: 0 });

                });
            }

            function parseItems(scope: ng.IScope, attributes: ng.IAttributes): Array<any> {
                var match = attributes["virtualFor"].match(/^\s*(.+)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/);
                if (match) {
                    var collectionStringArray = match[2].split(".");
                    var items:any = scope;
                    for (var i = 0; i < collectionStringArray.length; i++) {
                        items = items[collectionStringArray[i]];
                    }
                    return items;
                } else {
                    return JSON.parse(attributes["virtualFor"]);
                }
            }

            function removeCustomAttributes(clone: ng.IAugmentedJQuery, prefix:string) {
                var names: Array<string> = [];
                var attributes = clone[0].attributes;
                for (var i = 0; i < attributes.length; i++) {
                    if (attributes[i].nodeName.indexOf(prefix) > -1)
                        names.push(attributes[i].nodeName);
                }

                names.forEach((name: string) => { clone[0].removeAttribute(name); });

            }

            function verifyRepeatExpression (repeatExpression) {
                if (repeatExpression.match(/limitTo/) || repeatExpression.match(/startFrom/)) {
                    throw new Error('"limitTo" and "startFrom" filters are not allowed in directive');
                }
            };
        }

    }

    angular.module("virtualFor").directive("virtualFor", ["virtualFor.getHtml","virtualFor.renderer",VirtualFor.createInstance]);
}