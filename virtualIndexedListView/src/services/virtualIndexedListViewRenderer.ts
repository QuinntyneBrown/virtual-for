﻿/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    "use strict";
    
    class VirtualIndexedListViewRenderer implements IVirtualIndexedListViewRenderer {
        constructor(private $compile: ng.ICompileService,
            private $interval: ng.IIntervalService,
            private getY: IGetY,
            private injector: IInjector,
            private safeDigest: ISafeDigestFn,
            private transformY: ITransformY) { }

        public createInstance = (options: any) => {
            var instance = new VirtualIndexedListViewRenderer(this.$compile, this.$interval, this.getY, this.injector, this.safeDigest, this.transformY);
            instance.attributes = options.attributes;
            instance.scope = options.scope;
            instance.element = options.element;
            instance.template = options.template;
            
            instance.viewPort = this.injector.get({ interface: "IViewPort", element: instance.element });
            instance.container = this.injector.get({ interface: "IContainer", element: instance.element });
            instance.collectionManager = this.injector.get({ interface: "ICollectionManager", element: instance.element, scope: options.scope, searchTermNameOnScope: options.searchTermNameOnScope, filterFnNameOnVm: options.filterFnNameOnVm, items: options.items, dataService: options.dataService, attributes: options.attributes });
            instance.renderedNodes = this.injector.get({ interface: "IRenderedNodes", container: instance.container });

            if (instance.collectionManager instanceof LazyLoadCollectionManager) instance.$interval((<ILazyLoadCollectionManager>instance.collectionManager).loadMore, 1000, null, false);
            
            instance.scope.$on(instance.scrollEventName, (event:any, criteria:any) => {
                instance.collectionManager.getIndexByCriteriaAsync({ criteria: criteria }).then((result: any) => {
                    instance.viewPort.scrollTo(result.index * instance.itemHeight);
                });
            });

            instance.collectionManager.subscribe({ callback: instance.forceRender });
            instance.container.setHeight(instance.collectionManager.numberOfItems * instance.itemHeight);

            instance.$interval(() => {
                instance.render({
                    scrollY: instance.viewPort.scrollY,
                    lastScrollY: instance.lastYScroll
                });
                instance.lastYScroll = instance.viewPort.scrollY;
            }, 10,null, false);

            return instance;
        }

        public render = (options: IRenderOptions) => {
            if (options.force) return this.forceRender();            
            if (this.hasRendered === false) return this.initialRender();
            if (options.lastScrollY && options.scrollY > options.lastScrollY) return this.renderDown(options);            
            if (options.lastScrollY && options.scrollY < options.lastScrollY) return this.renderUp(options);           
            if (options.lastScrollY && options.scrollY == options.lastScrollY) return this.stabilizeRender(options);            
        }

        private forceRender = () => {
            if (!this.hasRendered) return;
            this.container.reInitialize({ height: this.collectionManager.numberOfItems * this.itemHeight });
            this.initialRender();
            this.safeDigest(this.scope);                   
        }

        public initialRender = () => {
            for (var i = 0; i < this.numberOfRenderedItems; i++) {
                var childScope: any = this.scope.$new(true);
                childScope[this.itemName] = this.collectionManager.items[i];
                childScope.$$index = i;
                var itemContent = this.$compile(angular.element(this.template))(childScope);
                this.container.augmentedJQuery.append(itemContent);
            }
            this.hasRendered = true;
        }

        public renderDown = (options: IRenderOptions) => {

            var reachedBottom = false;
            var allNodesHaveBeenMoved = false;
            var digestNeeded = false;

            do {
                var headAndTail = this.renderedNodes.getHeadAndTail();
                var tail = headAndTail.tail;
                var head = headAndTail.head;

                if (tail.bottom >= this.container.bottom)
                    reachedBottom = true;

                if (head.bottom >= options.scrollY)
                    allNodesHaveBeenMoved = true;

                if (!reachedBottom && !allNodesHaveBeenMoved) {
                    var index = (<any>angular.element(tail.node).scope()).$$index;
                    this.moveAndUpdateScope({
                        node: head.node,
                        position: (this.numberOfRenderedItems * this.itemHeight) + this.getY(head.node),
                        index: index + 1,
                        item: this.collectionManager.items[index + 1]
                    });
                    digestNeeded = true;
                }

            } while (!reachedBottom && !allNodesHaveBeenMoved)

            if (digestNeeded) this.safeDigest(this.scope);
        }

        public moveAndUpdateScope = (options:any) => {
            this.transformY(options.node, options.position);
            var scope: any = angular.element(options.node).scope();
            scope[this.itemName] = options.item;
            scope.$$index = options.index;
        }

        public renderUp = (options: IRenderOptions) => {
            var reachedTop = false;
            var allNodesHaveBeenMoved = false;
            var digestNeeded = false;

            do {
                var headAndTail = this.renderedNodes.getHeadAndTail();
                var tail = headAndTail.tail;
                var head = headAndTail.head;

                if (tail.bottom <= this.container.htmlElement.offsetTop + (this.itemHeight * this.numberOfRenderedItems))
                    reachedTop = true;

                if (tail.top <= (this.viewPort.scrollY + this.viewPort.height))
                    allNodesHaveBeenMoved = true;

                if (!reachedTop && !allNodesHaveBeenMoved) {                    
                    var index = (<any>angular.element(head.node).scope()).$$index;
                    this.moveAndUpdateScope({
                        node: tail.node,
                        position: this.getY(tail.node) - (this.numberOfRenderedItems * this.itemHeight),
                        index: index - 1,
                        item: this.collectionManager.items[index - 1]
                    });
                    digestNeeded = true;
                }

            } while (!reachedTop && !allNodesHaveBeenMoved)

            if (digestNeeded) this.safeDigest(this.scope);
        }

        public stabilizeRender = (options: IRenderOptions) => {
            var headAndTail = this.renderedNodes.getHeadAndTail();
            if (headAndTail.head.top > options.scrollY) this.renderUp(options);
            if (headAndTail.tail.bottom <= options.scrollY + this.viewPort.height) this.renderDown(options);
        }

        public get numberOfRenderedItems() {
            var max = Math.ceil((this.viewPort.height + this.container.htmlElement.offsetTop) / Number(this.itemHeight));
            if (this.collectionManager.numberOfItems < max)
                return this.collectionManager.numberOfItems;
            return max;
        }

        public hasRendered: boolean = false;

        public get itemName() { return this.attributes[this.controlPrefix + "ItemName"]; }

        public get itemHeight() { return Number(this.attributes[this.controlPrefix + "ItemHeight"]); }

        public get name() { return this.attributes[this.controlPrefix + "Name"]; }

        public element: ng.IAugmentedJQuery;

        public template: string;        
        

        public get scrollEventName() { return this.controlPrefix + "Scroll" + this.name; }
        public scope: any;
        public lastYScroll: number = 0;
        private collectionManager: ICollectionManager;
        private container: IContainer;
        private viewPort: IViewPort;
        private renderedNodes: IRenderedNodes;
        private attributes: ng.IAttributes;
        private get controlPrefix() { return "virtualIndexedListView"; }
    }

    angular.module("virtualIndexedListView").service("virtualIndexedListViewRenderer", ["$compile",
        "$interval",
        "virtualIndexedListView.getY",
        "virtualIndexedListView.injector",
        "virtualIndexedListView.safeDigest",
        "virtualIndexedListView.transformY",
        VirtualIndexedListViewRenderer]);
} 