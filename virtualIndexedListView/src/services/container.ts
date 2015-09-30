/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    class Container implements IContainer {

        constructor(private getY: IGetY) { }

        public createInstance = (options: IContainerInstanceOptions) => {
            var instance = new Container(this.getY);
            var container = angular.element("<div class='container'></div>");
            container[0].style.padding = "0";
            container[0].style.margin = "0";
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

        public isNodeAtBottom = (options: any) => {
            var nodeBottom = this.getY(options.node) + options.node.offsetTop + options.node.offsetTop;
            return nodeBottom === this.height;
        }

        public isNodeAtTop = (options: any) => {
            var nodeTop = this.getY(options.node) + options.node.offsetTop;
            return nodeTop === this.top;
        }

        public get height() { return this.htmlElement.offsetHeight; }

        public setHeight = (value: number) => { this.augmentedJQuery.css("height", value); }

        public get bottom() { return this.htmlElement.offsetHeight + this.htmlElement.offsetTop; }

        public get top() { return this.htmlElement.offsetTop; }

        private _augmentedJQuery: ng.IAugmentedJQuery;

        public get augmentedJQuery() { return this._augmentedJQuery; }

        public set augmentedJQuery(value: ng.IAugmentedJQuery) { this._augmentedJQuery = value; }

        public get htmlElement() { return this.augmentedJQuery[0]; }



    }

    angular.module("virtualIndexedListView").service("virtualIndexedListView.container", ["virtualIndexedListView.getY",Container]);
} 