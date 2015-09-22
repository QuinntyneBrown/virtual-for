/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    class ViewPort implements IViewPort {
        constructor(private $window:ng.IWindowService) {
            
        }

        public createInstance = (options: IViewPortInstanceOptions) => {
            var instance = new ViewPort(this.$window);
            instance.scrollableParentElement = instance.getScrollableParent(options.element[0]);           
            return instance;
        }

        private scrollableParentElement: ng.IAugmentedJQuery;

        private _scrollY: number;

        public get scrollY() {

            if (this.scrollableParentElement)
                return (<HTMLElement>this.scrollableParentElement[0]).scrollTop;

            return this.$window.pageYOffset;
        }

        private _height: number;

        public get height() {
            if (this.scrollableParentElement)
                return (<HTMLElement>this.scrollableParentElement[0]).offsetHeight;

            return this.$window.innerHeight;
        }

        public get bottom() {
            return this.scrollY + this.height;
        }

        public getScrollableParent = (hTMLElement: HTMLElement) => {

            if (hTMLElement.tagName == "HTML")
                return null;

            var scrollYCssValue = angular.element(hTMLElement).css("overflowY");
            if (scrollYCssValue == "scroll" || scrollYCssValue == "auto")
                return angular.element(hTMLElement);

            if (hTMLElement.parentNode)
                return this.getScrollableParent(<HTMLElement>hTMLElement.parentNode);
        }
    }

    angular.module("virtualIndexedListView").service("virtualIndexedListView.viewPort", ["$window",ViewPort]);
}