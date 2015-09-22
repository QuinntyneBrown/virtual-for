/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    class VirtualIndexedListViewManager implements IVirtualIndexedListViewManager {

        constructor(private $injector: ng.auto.IInjectorService,
            private $interval: ng.IIntervalService,
            private $timeout: ng.ITimeoutService,
            private $window: ng.IWindowService) { }

        public createInstance = (options: any) => {
            var virtualIndexedListViewRenderer: IVirtualIndexedListViewRenderer = (<IVirtualIndexedListViewRenderer>this.$injector.get("virtualIndexedListViewRenderer"));

            var instance = new VirtualIndexedListViewManager(this.$injector, this.$interval, this.$timeout, this.$window);
            instance.element = options.element;
            instance.scope = options.scope;
            instance.template = options.template;


            instance.virtualIndexedListViewRenderer = virtualIndexedListViewRenderer.createInstance({
                containerHeight: options.items.length * options.itemHeight,
                items: options.items,
                itemName: options.itemName,
                itemHeight: options.itemHeight,
                element: options.element,
                scope: options.scope,
                template: options.template
            });

            return instance;
        }


        public render = (options?: any) => {
            this.virtualIndexedListViewRenderer.render({});
        }

        public elementCSS: CSSStyleDeclaration;

        public element: ng.IAugmentedJQuery;

        public scope: ng.IScope;

        public template: string;

        public itemName: string;

        public itemHeight: number;

        public items: any[];

        public virtualIndexedListViewRenderer: IVirtualIndexedListViewRenderer;

        public timer: any;

        public debouceRender = () => {

            this.$timeout.cancel(this.timer);

            this.timer = this.$timeout(() => {
                this.render({});
            }, 250, false);

        }

        public onScroll = (e: Event) => {
            if (this.lastScrollY == window.pageYOffset) {
                setTimeout(this.debouceRender, 100);
                return;
            } else {
                this.lastScrollY = window.pageYOffset;
            }
        }

        public lastScrollY: number = window.pageYOffset; 

        public scrollY: number = window.pageYOffset;

        public innerHeight: number;

        public topViewPort: number;

        public bottomViewPort: number;
    }

    angular.module("virtualIndexedListView").service("virtualIndexedListViewManager", ["$injector", "$interval", "$timeout", "$window", VirtualIndexedListViewManager]);
}

