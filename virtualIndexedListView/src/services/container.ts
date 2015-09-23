/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    class Container implements IContainer {
        constructor() {

        }

        public createInstance = (options: IContainerInstanceOptions) => {
            var instance = new Container();

            var container = angular.element("<div class='container'></div>");

            options.element.append(container);

            instance.augmentedJQuery = options.element.find(".container");

            return instance;
        }

        public reInitialize = (options: any) => {
            for(var i = 0; i < this.htmlElement.children.length; i++) {
                var oldScope = angular.element(this.htmlElement.children[i]).scope();
                oldScope.$destroy();
            }

            this.htmlElement.innerHTML = "";

            this.setHeight(options.height);
        }

        public get height() {
            return this.htmlElement.offsetHeight;
        }

        public setHeight = (value: number) => {
            this.augmentedJQuery.css("height", value);
        }

        public get bottom() {
            return this.htmlElement.offsetHeight + this.htmlElement.offsetTop;
        }

        public get top() {
            return this.htmlElement.offsetTop;
        }

        private _augmentedJQuery: ng.IAugmentedJQuery;

        public get augmentedJQuery() {
            return this._augmentedJQuery;
        }

        public set augmentedJQuery(value: ng.IAugmentedJQuery) {
            this._augmentedJQuery = value;
        }

        public get htmlElement() {
            return this.augmentedJQuery[0];
        }

    }

    angular.module("virtualIndexedListView").service("virtualIndexedListView.container", [Container]);
} 