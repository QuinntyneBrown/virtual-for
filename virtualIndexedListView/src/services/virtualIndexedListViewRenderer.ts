/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    "use strict";
    
    class VirtualIndexedListViewRenderer implements IVirtualIndexedListViewRenderer {
        constructor(private $compile: ng.ICompileService, private $window: ng.IWindowService) {

        }

        public createInstance = (options: any) => {
            var instance = new VirtualIndexedListViewRenderer(this.$compile, this.$window);
            instance.containerHeight = options.containerHeight;
            instance.items = options.items;
            instance.itemName = options.itemName;
            instance.scope = options.scope;
            instance.element = options.element;
            instance.template = options.template;
            instance.itemHeight = options.itemHeight;
            return instance;
        }

        public render = (options: any) => {

            this.innerHeight = this.$window.innerHeight;

            var visibleItems = Math.ceil(this.innerHeight / this.itemHeight);

            if (this.hasRendered === false) {

                var parentNode: any = (<any>this.element[0]).parentNode;

                var containerElement = angular.element("<div class='container'></div>");

                containerElement.css("height", this.containerHeight);

                this.element.append(containerElement);

                var rect = containerElement[0].getBoundingClientRect();


                for (var i = 0; i < visibleItems; i++) {
                    var childScope = this.scope.$new(true);
                    childScope[this.itemName] = this.items[i];
                    var itemContent = this.$compile(angular.element(this.template))(childScope);
                    containerElement.append(itemContent);
                }

                
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

        public innerHeight: number;

        public itemHeight: number;
    }

    angular.module("virtualIndexedListView").service("virtualIndexedListViewRenderer", ["$compile", "$window", VirtualIndexedListViewRenderer]);
} 