/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    "use strict";
    
    class VirtualIndexedListViewRenderer implements IVirtualIndexedListViewRenderer {
        constructor(private $compile: ng.ICompileService,
            private $injector: ng.auto.IInjectorService,
            private $interval: ng.IIntervalService,
            private $timeout: ng.ITimeoutService,
            private getRenderedNodesComputedInfo:any,
            private getScrollDirection:any,
            private getY: IGetY,
            private observeOnScope: any,
            private transformY: ITransformY) {

        }

        public createInstance = (options: any) => {
            var instance = new VirtualIndexedListViewRenderer(this.$compile, this.$injector, this.$interval, this.$timeout, this.getRenderedNodesComputedInfo, this.getScrollDirection, this.getY, this.observeOnScope, this.transformY);
            instance.items = options.items;
            instance.itemName = options.itemName;
            instance.scope = options.scope;
            instance.element = options.element;
            instance.template = options.template;
            instance.itemHeight = Number(options.itemHeight);
            instance.viewPort = (<IViewPort>this.$injector.get("virtualIndexedListView.viewPort")).createInstance({ element: instance.element });
            instance.container = (<IContainer>this.$injector.get("virtualIndexedListView.container")).createInstance({ element: instance.element });
            instance.container.setHeight(instance.items.length * instance.itemHeight);

            if (instance.numberOfRenderedItems > instance.items.length)
                instance.numberOfRenderedItems = instance.items.length;

            instance.$interval(() => {
                instance.render({
                    scrollY: instance.viewPort.scrollY,
                    lastScrollY: instance.lastYScroll,
                    viewPortHeight: instance.viewPort.height
                });
                instance.lastYScroll = instance.viewPort.scrollY;
            }, 10,null, false);

            var timeoutPromise:any = null;

            instance.observeOnScope(instance.scope, 'vm.filterTerm')
                .map(function (data) {
                    return data;
                })
                .subscribe(function (change) {
                instance.filterTerm.observedChange = change;
                instance.filterTerm.newValue = change.newValue;
                instance.filterTerm.oldValue = change.oldValue;
                instance.filterFn = (value: any) => {
                    return value.name.indexOf(instance.filterTerm.newValue) > -1;
                }

                if (timeoutPromise)
                    instance.$timeout.cancel(timeoutPromise);

                timeoutPromise = instance.$timeout(() => {
                        instance.render({ force: true, lastScrollY: 0, scrollY: 0, viewPortHeight: instance.viewPort.height });
                }, 10, false);
            });

            instance.filterFn = instance.scope.filterFn;

            return instance;
        }

        public _filterTerm: any = {};

        public get filterTerm() {
            return this._filterTerm;
        }

        public set filterTerm(value: any) {
            this._filterTerm = value;
        }

        public render = (options?: IRenderOptions) => {

            if (!options) {
                options = {
                    lastScrollY:  0,
                    scrollY: 0,
                    viewPortHeight: this.viewPort.height
                };
            }

            if (options.force ) {
                this.forceRender(options);
                return;
            }

            if (this.hasRendered === false) {
                this.initialRender(options);
            }

            if (this.getScrollDirection(options.scrollY, options.lastScrollY) === ScrollingDirection.Down) {
                this.renderDown(options);
                return;
            }

            if (this.getScrollDirection(options.scrollY, options.lastScrollY) === ScrollingDirection.Up) {
                this.renderUp(options);
                return;
            }

            if (this.getScrollDirection(options.scrollY, options.lastScrollY) === ScrollingDirection.None) {
                this.stabilizeRender(options);
                return;
            }

        }

        public forceRender = (options: IRenderOptions) => {

            if (!this.hasRendered)
                return;

            this.container.reInitialize({ height: this.items.length * this.itemHeight });

            this.initialRender(options);

            try {
                this.scope.$digest();
            } catch (error) {

            }            
        }

        public initialRender = (options: IRenderOptions) => {
            for (var i = 0; i < this.numberOfRenderedItems; i++) {
                var childScope: any = this.scope.$new(true);
                childScope[this.itemName] = this.items[i];
                childScope.$$index = i;
                var itemContent = this.$compile(angular.element(this.template))(childScope);
                this.container.augmentedJQuery.append(itemContent);
            }
            this.hasRendered = true;
        }

        public renderDown = (options: IRenderOptions) => {
            var reachedBottom = false;

            var allNodesHaveBeenMoved = false;

            var item = null;

            var index = null;

            do {

                var cachedItemsList = (<any[]>this.getRenderedNodesComputedInfo({ getY: this.getY, renderedNodes: this.container.htmlElement.children, itemHeight: this.itemHeight, desc: false }));

                if (cachedItemsList[cachedItemsList.length - 1].bottom >= this.container.bottom) {
                    reachedBottom = true;
                } else {
                    index = cachedItemsList[cachedItemsList.length - 1].index + 1;
                    item = this.items[index];
                }

                if (cachedItemsList[0].bottom >= options.scrollY)
                    allNodesHaveBeenMoved = true;


                if (!reachedBottom && !allNodesHaveBeenMoved) {
                    this.transformY(cachedItemsList[0].node, (this.numberOfRenderedItems * this.itemHeight) + this.getY(cachedItemsList[0].node));
                    var scope: any = angular.element(cachedItemsList[0].node).scope();
                    scope[this.itemName] = item;
                    scope.$$index = index;
                    scope.$digest();
                }

            } while (!reachedBottom && !allNodesHaveBeenMoved)
        }

        public renderUp = (options: IRenderOptions) => {
            var reachedTop = false;

            var allNodesHaveBeenMoved = false;

            var item = null;

            var index = null;

            do {

                var cachedItemsList = (<any[]>this.getRenderedNodesComputedInfo({ getY: this.getY, renderedNodes: this.container.htmlElement.children, itemHeight: this.itemHeight, desc: true }));

                if (cachedItemsList[cachedItemsList.length - 1].top <= 0) {
                    reachedTop = true;
                } else {
                    index = cachedItemsList[cachedItemsList.length - 1].index - 1;
                    item = this.items[index];
                }

                if (cachedItemsList[0].top <= options.scrollY + options.viewPortHeight)
                    allNodesHaveBeenMoved = true;

                if (!reachedTop && !allNodesHaveBeenMoved) {
                    this.transformY(cachedItemsList[0].node, this.getY(cachedItemsList[0].node) - (this.numberOfRenderedItems * this.itemHeight));
                    var scope: any = angular.element(cachedItemsList[0].node).scope();
                    scope[this.itemName] = item;
                    scope.$$index = index;
                    scope.$digest();
                }

            } while (!reachedTop && !allNodesHaveBeenMoved)            
        }

        public stabilizeRender = (options: IRenderOptions) => {

            var cachedItemsList = (<any[]>this.getRenderedNodesComputedInfo({ getY: this.getY, renderedNodes: this.container.htmlElement.children, itemHeight: this.itemHeight, desc: false }));

            var top = cachedItemsList[0].top;
            var bottom = cachedItemsList[cachedItemsList.length - 1].bottom;


            if (top > options.scrollY) {
                console.log("missing items on top");
            }

            if (bottom <= options.scrollY + options.viewPortHeight) {
                this.renderDown(options);
            }
        }

        private viewPort: IViewPort;

        public hasRendered: boolean = false;

        public element: ng.IAugmentedJQuery;

        public template: string;

        public get containerHeight() {
            return this.items.length * this.itemHeight;
        }

        private _items: any[];

        public get items() {

            if (this.filterFn && this.filterTerm.newValue)
                return this._items.filter(this.filterFn);

            return this._items;
        }

        public set items(value: any[]) {
            this._items = value;
        }

        public container: IContainer;

        public itemName: string;

        public filterFn:any;

        public scope: any;

        public itemHeight: number;

        public lastYScroll: number = 0;

        private _numberOfRenderedItems;

        public get numberOfRenderedItems() {
            if (!this._numberOfRenderedItems)
                return Math.ceil(1380 / Number(this.itemHeight));

            return this._numberOfRenderedItems;
        }

        public set numberOfRenderedItems(value:number) {
            this._numberOfRenderedItems = value;
        }

    }

    angular.module("virtualIndexedListView").service("virtualIndexedListViewRenderer", ["$compile",
        "$injector",
        "$interval",
        "$timeout",
        "virtualIndexedListView.getRenderedNodesComputedInfo",
        "virtualIndexedListView.getScrollDirection",
        "virtualIndexedListView.getY",
        "observeOnScope",
        "virtualIndexedListView.transformY", VirtualIndexedListViewRenderer]);
} 