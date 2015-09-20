/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    "use strict";
    
    class VirtualIndexedListViewRenderer implements IVirtualIndexedListViewRenderer {
        constructor(private $compile: ng.ICompileService) {

        }

        public createInstance = (options: any) => {
            var instance = new VirtualIndexedListViewRenderer(this.$compile);
            instance.containerHeight = options.containerHeight;
            instance.items = options.items;
            instance.itemName = options.itemName;
            instance.scope = options.scope;
            instance.element = options.element;
            instance.template = options.template;
            return instance;
        }

        public render = (options: any) => {

            if (this.hasRendered === false) {

                var containerElement = angular.element("<div class='container'></div>");

                for (var i = 0; i < this.items.length; i++) {
                    var childScope = this.scope.$new(true);
                    childScope[this.itemName] = this.items[i];
                    var itemContent = this.$compile(angular.element(this.template))(childScope);
                    containerElement.append(itemContent);
                }

                this.element.append(containerElement);
            }

            this.hasRendered = true;
        }

        public hasRendered: boolean = false;

        public element: ng.IAugmentedJQuery;

        public template: string;

        public containerHeight: number;

        public items: any[];

        public itemName: string;

        public scope: ng.IScope;

    }

    angular.module("virtualIndexedListView").service("virtualIndexedListViewRenderer", ["$compile", VirtualIndexedListViewRenderer]);
} 