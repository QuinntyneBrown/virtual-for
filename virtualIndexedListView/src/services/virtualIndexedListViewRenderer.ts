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

            var containerElement: ng.IAugmentedJQuery;

            if (options.force ) {

                var container = this.containerElement[0];

                for (var i = 0; i < container.children.length; i++) {
                    var oldScope = angular.element(container.children[i]).scope();
                    oldScope.$destroy();
                }

                container.innerHTML = "";

                angular.element(container).css("height", this.containerHeight);

                for (var i = 0; i < this.numberOfRenderedItems; i++) {
                    var childScope: any = this.scope.$new(true);
                    childScope[this.itemName] = this.items[i];
                    childScope.$$index = i;
                    var itemContent = this.$compile(angular.element(this.template))(childScope);
                    angular.element(container).append(itemContent);
                }

                try {
                    this.scope.$digest();
                } catch (error) {

                }

                this.hasRendered = true;
            }


            if (this.hasRendered === false) {
                containerElement = angular.element("<div class='container'></div>");
                containerElement.css("height", this.containerHeight);

                this.element.append(containerElement);

                for (var i = 0; i < this.numberOfRenderedItems; i++) {
                    var childScope:any = this.scope.$new(true);
                    childScope[this.itemName] = this.items[i];
                    childScope.$$index = i;
                    var itemContent = this.$compile(angular.element(this.template))(childScope);
                    containerElement.append(itemContent);
                }

                try {
                    this.scope.$digest();
                } catch (error) {
                    
                }
            }

            if (this.getScrollDirection(options.scrollY, options.lastScrollY) === ScrollingDirection.Down) {

                var reachedBottom = false;

                var allNodesHaveBeenMoved = false;

                var item = null;

                var index = null;

                do {

                    var cachedItemsList = (<any[]>this.getRenderedNodesComputedInfo({ getY: this.getY, renderedNodes: this.renderedNodes, itemHeight: this.itemHeight, desc: false }));
                        
                    if (cachedItemsList[cachedItemsList.length - 1].bottom >= this.containerBottom) {
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

            if (this.getScrollDirection(options.scrollY, options.lastScrollY) === ScrollingDirection.Up) {

                var reachedTop = false;

                var allNodesHaveBeenMoved = false;

                var item = null;

                var index = null;

                do {

                    var cachedItemsList = (<any[]>this.getRenderedNodesComputedInfo({ getY: this.getY, renderedNodes: this.renderedNodes, itemHeight: this.itemHeight, desc: true }));

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

            if (this.hasRendered && this.getScrollDirection(options.scrollY, options.lastScrollY) === ScrollingDirection.None) {

                var cachedItemsList = (<any[]>this.getRenderedNodesComputedInfo({ getY: this.getY, renderedNodes: this.renderedNodes, itemHeight: this.itemHeight, desc: false }));

                var top = cachedItemsList[0].top;
                var bottom = cachedItemsList[cachedItemsList.length - 1].bottom;


                if (top > options.scrollY) {
                    console.log("missing items on top");
                }

                if (bottom <= options.scrollY + options.viewPortHeight) {
                    console.log("missing items on bottom");
                    var reachedBottom = false;

                    var allNodesHaveBeenMoved = false;

                    var item = null;

                    var index = null;

                    do {

                        var cachedItemsList = (<any[]>this.getRenderedNodesComputedInfo({ getY: this.getY, renderedNodes: this.renderedNodes, itemHeight: this.itemHeight, desc: false }));

                        if (cachedItemsList[cachedItemsList.length - 1].bottom >= (this.items.length * this.itemHeight)) {
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
            }


            this.hasRendered = true;

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

        private _containerElement: ng.IAugmentedJQuery;

        public get containerElement() {
            if (!this._containerElement)
                return this.element.find(".container");

            return this._containerElement;
        }

        public set containerElement(value: ng.IAugmentedJQuery) {
            this._containerElement = value;
        }

        public get containerBottom() {
            return this.containerElement[0].offsetHeight + this.containerElement[0].offsetTop;
        }

        public get containerTop() {
            return this.containerElement[0].offsetTop;
        }

        public get renderedNodes(): Array<HTMLElement> {            
            return <any>this.containerElement[0].children;
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