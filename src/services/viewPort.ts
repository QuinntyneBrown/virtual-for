﻿/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualFor {

    export class ViewPort implements IViewPort {
        constructor(private $window:ng.IWindowService) { }

        public createInstance = (options: IViewPortInstanceOptions) => {
            var instance = new ViewPort(this.$window);
            instance.scrollableParentElement = instance.getScrollableParent(options.element[0]);  
            return instance;
        }

        private scrollableParentElement: ng.IAugmentedJQuery;
        
        private get windowElement() { return angular.element(this.$window); }

        public get scrollY() {

            if (this.scrollableParentElement)
                return (<HTMLElement>this.scrollableParentElement[0]).scrollTop;

            return this.windowElement.scrollTop();
        }

        private _height: number;

        public get height() {
            if (this.scrollableParentElement) { return (<HTMLElement>this.scrollableParentElement[0]).offsetHeight; }

            return this.windowElement.height();
        }

        public get bottom() {
            return this.scrollY + this.height;
        }

        public getScrollableParent = (hTMLElement: HTMLElement):any => {
            
            if (hTMLElement.tagName == "HTML")
                return null;

            var scrollYCssValue = angular.element(hTMLElement).css("overflowY");

            if (scrollYCssValue == "scroll" || scrollYCssValue == "auto")
                return angular.element(hTMLElement);

            if (hTMLElement.parentNode)
                return this.getScrollableParent(<HTMLElement>hTMLElement.parentNode);
        }

        public scrollTo = (value: number) => {

            if (this.scrollableParentElement) {
                this.scrollableParentElement[0].scrollTop = value;
            } else {
                this.$window.scrollTo(0,value);
            }
        }
    }

    angular.module("virtualFor").service("virtualFor.viewPort", ["$window",ViewPort]);
}