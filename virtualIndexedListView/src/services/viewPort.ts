/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    class ViewPort implements IViewPort {
        constructor(private $window:ng.IWindowService) {
            
        }

        public createInstance = (options: IViewPortInstanceOptions) => {
            var instance = new ViewPort(this.$window);
            instance.element = options.element;            
            return instance;
        }

        private element: ng.IAugmentedJQuery;

        private _scrollY: number;

        public get scrollY() {

            if (this.element.css("overflowY") == "scroll")
                return (<HTMLElement>this.element[0]).scrollTop;

            return this.$window.pageYOffset;
        }

        private _height: number;

        public get height() {
            if (this.element.css("overflowY") == "scroll")
                return (<HTMLElement>this.element[0]).offsetHeight;

            return this.$window.innerHeight;
        }

        public get bottom() {
            return this.scrollY + this.height;
        }
    }

    angular.module("virtualIndexedListView").service("virtualIndexedListView.viewPort", ["$window",ViewPort]);
}