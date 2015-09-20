/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    class VirtualIndexedListViewManager implements IVirtualIndexedListViewManager {

        constructor(private $injector: ng.auto.IInjectorService, private $timeout: ng.ITimeoutService) { }

        public createInstance = (options: any) => {
            var instance = new VirtualIndexedListViewManager(this.$injector, this.$timeout);
            instance.element = options.element;
            instance.scope = options.scope;
            instance.template = options.template;

            var virtualIndexedListViewRenderer: IVirtualIndexedListViewRenderer = (<IVirtualIndexedListViewRenderer>this.$injector.get("virtualIndexedListViewRenderer"));

            instance.virtualIndexedListViewRenderer = virtualIndexedListViewRenderer.createInstance({
                containerHeight: options.items.length * options.itemHeight,
                items: options.items,
                itemName: options.itemName,
                itemHeight: options.itemHeight,
                element: options.element,
                scope: options.scope,
                template: options.template
            });

            instance.elementCSS = options.window.getComputedStyle(instance.element[0], null);
            if (instance.elementCSS && instance.elementCSS.overflowY && (instance.elementCSS.overflowY == "auto" || instance.elementCSS.overflowY == "scroll")) { instance.element[0].addEventListener("scroll", instance.debouceRender); }
            options.window.addEventListener("mousewheel", instance.debouceRender);
            options.window.addEventListener("scroll", instance.debouceRender);
            options.window.addEventListener("resize", instance.debouceRender);

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

    }

    angular.module("virtualIndexedListView").service("virtualIndexedListViewManager", ["$injector","$timeout",VirtualIndexedListViewManager]);
}

