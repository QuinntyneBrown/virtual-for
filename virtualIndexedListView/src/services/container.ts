/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    class Container implements IContainer {
        constructor() {
            
        }

        public createInstance = (options: IContainerInstanceOptions) => {
            return new Container();
        }

        public reInitialize = () => {
            
        }

        private _height: number;

        public get height() {
            return this._height;
        }

        public set height(value: number) {
            this._height = value;
        }

        private _bottom: number;

        public get bottom() {
            return this._bottom;
        }

        public set bottom(value: number) {
            this._bottom = value;
        }

        private _top: number;

        public get top() {
            return this._top;
        }

        public set top(value: number) {
            this._top = value;
        }

        private _augmentedJQuery: ng.IAugmentedJQuery;

        public get augmentedJQuery() {
            return this._augmentedJQuery;
        }

        public set augmentedJQuery(value: ng.IAugmentedJQuery) {
            this._augmentedJQuery = value;
        }

        private _htmlElement: HTMLElement;

        public get htmlElement() {
            return this._htmlElement;
        }

        public set htmlElement(value: HTMLElement) {
            this._htmlElement = value;
        }

    }

    angular.module("virtualIndexedListView").service("virtualIndexedListView.container", [Container]);
} 