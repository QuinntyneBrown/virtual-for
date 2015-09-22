/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    "use strict";
    
    class VirtualIndexedListViewRenderer implements IVirtualIndexedListViewRenderer {
        constructor(private $compile: ng.ICompileService, private $injector: ng.auto.IInjectorService, private $interval: ng.IIntervalService) {

        }

        public createInstance = (options: any) => {
            var instance = new VirtualIndexedListViewRenderer(this.$compile, this.$injector, this.$interval);
            instance.containerHeight = options.containerHeight;
            instance.items = options.items;
            instance.itemName = options.itemName;
            instance.scope = options.scope;
            instance.element = options.element;
            instance.template = options.template;
            instance.itemHeight = options.itemHeight;
            instance.viewPort = (<IViewPort>this.$injector.get("virtualIndexedListView.viewPort")).createInstance({ element: this.element });

            setInterval(() => {
                if (instance.lastYScroll != instance.viewPort.scrollY) {
                    instance.render({ scrollY: instance.viewPort.scrollY, lastScrollY: instance.lastYScroll, viewPortHeight: instance.viewPort.height });
                }
                instance.lastYScroll = instance.viewPort.scrollY;
            }, 200);

            return instance;
        }

        public render = (options: IRenderOptions) => {

            if (this.hasRendered === false) {
                var containerElement = angular.element("<div class='container'></div>");
                containerElement.css("height", this.containerHeight);

                this.element.append(containerElement);

                for (var i = 0; i < this.numberOfRenderedItems; i++) {
                    var childScope = this.scope.$new(true);
                    childScope[this.itemName] = this.items[i];
                    var itemContent = this.$compile(angular.element(this.template))(childScope);
                    containerElement.append(itemContent);
                }
            }

            if (this.getScrollDirections(options.scrollY, options.lastScrollY) === ScrollingDirection.Down) {
                // get all the completlly invisible items between 0 and scrollY 
                // order by the top asc,
                // translate each to bottom
            }

            if (this.getScrollDirections(options.scrollY, options.lastScrollY) === ScrollingDirection.Up) {
                // get all the completlly invisible items between viewPortBottom containerBottom and scrollY 
                // order by the top asc,
                // translate each to bottom
            }

            this.hasRendered = true;
        }

        public getScrollDirections = (scrollY:number, lastScrollY:number): ScrollingDirection => {
            if (lastScrollY && scrollY > lastScrollY) {
                return ScrollingDirection.Down;
            }

            if (lastScrollY && scrollY < lastScrollY) {
                return ScrollingDirection.Up;
            }

            return null;
        }

        private viewPort: IViewPort;

        public hasRendered: boolean = false;

        public element: ng.IAugmentedJQuery;

        public template: string;

        public containerHeight: number;

        public items: any[];

        public itemName: string;

        public scope: ng.IScope;

        public itemHeight: number;

        public lastYScroll: number = 0;

        public get numberOfRenderedItems() {

            var maximumScreenSize:number = 1380;

            return Math.ceil(maximumScreenSize / this.itemHeight);
        }
    }

    angular.module("virtualIndexedListView").service("virtualIndexedListViewRenderer", ["$compile", "$injector","$interval", VirtualIndexedListViewRenderer]);
} 