/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    "use strict";
    
    class VirtualIndexedListViewRenderer implements IVirtualIndexedListViewRenderer {
        constructor(private $compile: ng.ICompileService, private $injector: ng.auto.IInjectorService, private $interval: ng.IIntervalService, private getY: IGetY, private transformY: ITransformY) {

        }

        public createInstance = (options: any) => {
            var instance = new VirtualIndexedListViewRenderer(this.$compile, this.$injector, this.$interval, this.getY, this.transformY);
            instance.containerHeight = options.containerHeight;
            instance.items = options.items;
            instance.itemName = options.itemName;
            instance.scope = options.scope;
            instance.element = options.element;
            instance.template = options.template;
            instance.itemHeight = Number(options.itemHeight);
            instance.viewPort = (<IViewPort>this.$injector.get("virtualIndexedListView.viewPort")).createInstance({ element: instance.element });

            if (instance.numberOfRenderedItems > instance.items.length)
                instance.numberOfRenderedItems = instance.items.length;

            setInterval(() => {
                instance.render({
                    scrollY: instance.viewPort.scrollY,
                    lastScrollY: instance.lastYScroll,
                    viewPortHeight: instance.viewPort.height
                });
                instance.lastYScroll = instance.viewPort.scrollY;
            }, 10);

            return instance;
        }

        public render = (options: IRenderOptions) => {

            var containerElement: ng.IAugmentedJQuery;

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
            }

            if (this.getScrollDirections(options.scrollY, options.lastScrollY) === ScrollingDirection.Down) {

                var reachedBottom = false;

                var allNodesHaveBeenMoved = false;

                var item = null;

                var index = null;

                do {

                    var cachedItemsList = this.computeCacheItemsList();

                    if (this.cacheItemsItemList[this.cacheItemsItemList.length - 1].bottom >= (this.items.length * this.itemHeight)) {
                        reachedBottom = true;
                    } else {
                        index = this.cacheItemsItemList[this.cacheItemsItemList.length - 1].index + 1;
                        item = this.items[index];
                    }

                    if (cachedItemsList[0].bottom >= options.scrollY) 
                        allNodesHaveBeenMoved = true;
                    

                    if (!reachedBottom && !allNodesHaveBeenMoved) {
                        this.transformY(this.cacheItemsItemList[0].node, (this.numberOfRenderedItems * this.itemHeight) + this.getY(this.cacheItemsItemList[0].node));
                        var scope: any = angular.element(this.cacheItemsItemList[0].node).scope();
                        scope[this.itemName] = item;
                        scope.$$index = index;
                        scope.$digest();
                    }

                } while (!reachedBottom && !allNodesHaveBeenMoved)
                
            }

            if (this.getScrollDirections(options.scrollY, options.lastScrollY) === ScrollingDirection.Up) {

                var reachedTop = false;

                var allNodesHaveBeenMoved = false;

                var item = null;

                var index = null;

                do {

                    var cachedItemsList = this.computeCacheItemsList({ desc: true });

                    if (this.cacheItemsItemList[this.cacheItemsItemList.length - 1].top <= 0) {
                        reachedTop = true;
                    } else {
                        index = this.cacheItemsItemList[this.cacheItemsItemList.length - 1].index - 1;
                        item = this.items[index];
                    }

                    if (cachedItemsList[0].top <= options.scrollY + options.viewPortHeight)
                        allNodesHaveBeenMoved = true;

                    if (!reachedTop && !allNodesHaveBeenMoved) {
                        this.transformY(this.cacheItemsItemList[0].node, this.getY(this.cacheItemsItemList[0].node) - (this.numberOfRenderedItems * this.itemHeight));
                        var scope: any = angular.element(this.cacheItemsItemList[0].node).scope();
                        scope[this.itemName] = item;
                        scope.$$index = index;
                        scope.$digest();
                    }

                } while (!reachedTop && !allNodesHaveBeenMoved)
            }

            if (this.hasRendered && this.getScrollDirections(options.scrollY, options.lastScrollY) === ScrollingDirection.None) {

                var cachedItemsList = this.computeCacheItemsList();

                var top = cachedItemsList[0].top;
                var bottom = cachedItemsList[cachedItemsList.length - 1].bottom;


                if (top > options.scrollY) {
                    console.log("missing items on top");
                }

                if (bottom < options.scrollY + options.viewPortHeight) {
                    console.log("missing items on bottom");
                    var reachedBottom = false;

                    var allNodesHaveBeenMoved = false;

                    var item = null;

                    var index = null;

                    do {

                        var cachedItemsList = this.computeCacheItemsList();

                        if (this.cacheItemsItemList[this.cacheItemsItemList.length - 1].bottom >= (this.items.length * this.itemHeight)) {
                            reachedBottom = true;
                        } else {
                            index = this.cacheItemsItemList[this.cacheItemsItemList.length - 1].index + 1;
                            item = this.items[index];
                        }

                        if (cachedItemsList[0].bottom >= options.scrollY)
                            allNodesHaveBeenMoved = true;


                        if (!reachedBottom && !allNodesHaveBeenMoved) {
                            this.transformY(this.cacheItemsItemList[0].node, (this.numberOfRenderedItems * this.itemHeight) + this.getY(this.cacheItemsItemList[0].node));
                            var scope: any = angular.element(this.cacheItemsItemList[0].node).scope();
                            scope[this.itemName] = item;
                            scope.$$index = index;
                            scope.$digest();
                        }

                    } while (!reachedBottom && !allNodesHaveBeenMoved)
                }
            }


            this.hasRendered = true;

        }


        public computeCacheItemsList = (options?:any) => {
            this.cacheItemsItemList = [];

            for (var i = 0; i < this.renderedNodes.length; i++) {

                var y = this.getY(this.renderedNodes[i]);

                var offsetTop = this.renderedNodes[i].offsetTop;

                var itemHeight = this.itemHeight;

                this.cacheItemsItemList.push({
                    top: y + offsetTop,
                    bottom: y + offsetTop + itemHeight,
                    index: (<any>angular.element(this.renderedNodes[i]).scope()).$$index,
                    node: this.renderedNodes[i]
                });
            }

            if (options && options.desc) {
                this.cacheItemsItemList.sort((a: any, b: any) => {
                    return b.top - a.top;
                });       
            } else {
                this.cacheItemsItemList.sort((a: any, b: any) => {
                    return a.top - b.top;
                });                
            }

            return this.cacheItemsItemList;
        }

        public cacheItemsItemList:Array<any> = [];
         
        public getScrollDirections = (scrollY:number, lastScrollY:number): ScrollingDirection => {
            if (lastScrollY && scrollY > lastScrollY) {
                return ScrollingDirection.Down;
            }

            if (lastScrollY && scrollY < lastScrollY) {
                return ScrollingDirection.Up;
            }

            if (lastScrollY && scrollY === lastScrollY) {
                return ScrollingDirection.None;
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

        public get renderedNodes(): Array<HTMLElement> {            
            return <any>this.containerElement[0].children;
        }
    }

    angular.module("virtualIndexedListView").service("virtualIndexedListViewRenderer", ["$compile", "$injector", "$interval", "virtualIndexedListView.getY", "virtualIndexedListView.transformY", VirtualIndexedListViewRenderer]);
} 