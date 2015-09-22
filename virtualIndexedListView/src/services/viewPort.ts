/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    class ViewPort implements IViewPort {
        constructor(private $window:ng.IWindowService) {
            
        }

        public createInstance = (options: IViewPortInstanceOptions) => {

            var instance = new ViewPort(this.$window);

            return instance;
        }

        private _scrollY: number;

        public get scrollY() {
            return this.$window.pageYOffset;
        }

        private _height: number;

        public get height() {
            return this.$window.innerHeight;
        }

        public get bottom() {
            return this.scrollY + this.height;
        }
    }

    angular.module("virtualIndexedListView").service("virtualIndexedListView.viewPort", ["$window",ViewPort]);
}