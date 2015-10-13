﻿/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualFor {

    "use strict";

    export class Renderer implements IRenderer {
        constructor(private $compile: ng.ICompileService,
            private $interval: ng.IIntervalService,
            private $$rAF:any,
            private getY: IGetY,
            private injector: IInjector,
            private safeDigest: ISafeDigestFn,
            private transformY: ITransformY) { }

        public createInstance = (options: any) => {
            var instance = new Renderer(
                this.$compile,
                this.$interval,
                this.$$rAF,
                this.getY,
                this.injector,
                this.safeDigest,
                this.transformY);

            instance.attributes = options.attributes;
            instance.scope = options.scope;
            instance.element = options.element;
            instance.template = options.template;

            instance.viewPort = this.injector.get({ interfaceName: "IViewPort", element: instance.element });
            instance.container = this.injector.get({ interfaceName: "IContainer", element: instance.element });
            instance.collectionManager = this.injector.get({
                interfaceName: "ICollectionManager",
                element: instance.element,
                scope: options.scope,
                searchTermNameOnScope: options.searchTermNameOnScope,
                filterFnNameOnVm: options.filterFnNameOnVm,
                items: options.items,
                dataService: options.dataService,
                attributes: options.attributes
            });
            instance.renderedNodes = this.injector.get({ interfaceName: "IRenderedNodes", container: instance.container });

            if (instance.collectionManager instanceof LazyLoadCollectionManager)
                instance.$interval((<ILazyLoadCollectionManager>instance.collectionManager).loadMore, 1000, null, false);

            instance.scope.$on(instance.scrollEventName, instance.onScrollTo);
            instance.scope.$on(instance.removeItemEventName, instance.renderRemoveItem);
            instance.collectionManager.subscribe({ callback: instance.forceRender });
            instance.container.setHeight(instance.collectionManager.numberOfItems * instance.itemHeight);
            instance.$interval(instance.render, 1, null, false);
            instance.$interval(instance.onResize, 10, null, false);
            return instance;
        }

        public onScrollTo = (event: any, criteria: any) => {
            this.collectionManager.getIndexByCriteriaAsync({ criteria: criteria }).then((result: any) => {
                this.viewPort.scrollTo(result.index * this.itemHeight);
            });
        }

        public render = (options?: IRenderOptions) => {            
            if (options && options.force) return this.forceRender();
            if (this.hasRendered === false) return this.initialRender();
            if (this.viewPort.scrollY > this.lastScrollY) return this.renderTopToBottom();
            if (this.viewPort.scrollY < this.lastScrollY) return this.renderBottomToTop();
        }

        private forceRender = () => {
            if (!this.hasRendered) return;
            this.container.reInitialize({ height: this.collectionManager.numberOfItems * this.itemHeight });
            this.initialRender();
            this.safeDigest(this.scope);
        }

        public initialRender = () => {           
            var fragment = document.createDocumentFragment();
            for (var i = 0; i < this.numberOfRenderedItems; i++) {
                var childScope: any = this.scope.$new(true);
                childScope[this.itemName] = this.collectionManager.items[i];
                childScope.$$index = i;
                var itemContent = this.$compile(angular.element(this.template))(childScope);
                fragment.appendChild(itemContent[0]);
            }
            this.container.augmentedJQuery[0].appendChild(fragment);            
            this.hasRendered = true;
        }

        public renderTopToBottom = () => {
            console.log(this.calculateScrollBottomDiff());
            var reachedBottom = false;
            var allNodesHaveBeenMoved = false;
            var digestNeeded = false;

            do {
                var headAndTail = this.renderedNodes.getHeadAndTail();
                var tail = headAndTail.tail;
                var head = headAndTail.head;

                if ((<any>angular.element(tail.node).scope()).$$index == this.collectionManager.numberOfItems - 1)
                    reachedBottom = true;

                if (head.bottom >= this.viewPort.scrollY)
                    allNodesHaveBeenMoved = true;

                if (!reachedBottom && !allNodesHaveBeenMoved) {
                    var headY: number = this.getY(head.node);
                    var tailY: number = this.getY(tail.node);

                    var currentY = this.container.top + headY + head.node.offsetTop;
                    var desiredY = this.container.top + tailY + tail.node.offsetTop + this.itemHeight;
                    var delta = (desiredY - currentY) + headY;

                    var index = (<any>angular.element(tail.node).scope()).$$index;
                    this.moveAndUpdateScope({
                        node: head.node,
                        position: delta,
                        index: index + 1,
                        item: this.collectionManager.items[index + 1]
                    });
                    digestNeeded = true;
                }

            } while (!reachedBottom && !allNodesHaveBeenMoved)

            if (digestNeeded) this.safeDigest(this.scope);

            this.lastScrollY = this.viewPort.scrollY;
        }

        public renderBottomToTop = () => {
            console.log(this.calculateScrollBottomDiff());
            var reachedTop = false;
            var allNodesHaveBeenMoved = false;
            var digestNeeded = false;

            do {
                var headAndTail = this.renderedNodes.getHeadAndTail();
                var tail = headAndTail.tail;
                var head = headAndTail.head;

                if ((<any>angular.element(head.node).scope()).$$index == 0)
                    reachedTop = true;

                if (tail.top <= (this.viewPort.scrollY + this.viewPort.height))
                    allNodesHaveBeenMoved = true;

                if (!reachedTop && !allNodesHaveBeenMoved) {
                    var headY: number = this.getY(head.node);
                    var tailY: number = this.getY(tail.node);

                    var currentY = this.container.top + tailY + tail.node.offsetTop;
                    var desiredY = this.container.top + headY + head.node.offsetTop - this.itemHeight;
                    var delta = (desiredY - currentY) + tailY;

                    var index = (<any>angular.element(head.node).scope()).$$index;
                    this.moveAndUpdateScope({
                        node: tail.node,
                        position: delta,
                        index: index - 1,
                        item: this.collectionManager.items[index - 1]
                    });
                    digestNeeded = true;
                }

            } while (!reachedTop && !allNodesHaveBeenMoved)

            if (digestNeeded) this.safeDigest(this.scope);

            this.lastScrollY = this.viewPort.scrollY;
        }

        public renderRemoveItem = (event: any, options: any) => {
            var renderNodes = this.renderedNodes.getAll({ order: "asc" });
            var scope: any = null;
            this.collectionManager.items.splice(options.index, 1);
            this.collectionManager.numberOfItems = this.collectionManager.numberOfItems - 1;

            for (var i = 0; i < renderNodes.length; i++) {
                scope = angular.element(renderNodes[i].node).scope();
                scope[this.itemName] = this.collectionManager.items[scope.$$index];                
            }

            if (renderNodes.length > this.collectionManager.numberOfItems) {
                angular.element(renderNodes[renderNodes.length - 1].node).scope().$destroy();
                this.container.htmlElement.removeChild(renderNodes[renderNodes.length - 1].node);
                this.container.setHeight(renderNodes.length * this.itemHeight);
            } else {
                this.container.setHeight(this.collectionManager.numberOfItems * this.itemHeight);
            }

            this.safeDigest(this.scope);
        }

        public moveAndUpdateScope = (options: any) => {            
            this.transformY(options.node, options.position);            
            var scope: any = angular.element(options.node).scope();
            scope[this.itemName] = options.item;
            scope.$$index = options.index;
        }

        public calculateScrollBottomDiff = () => {
            
            return this.container.top;
        }

        public onResize = () => {
            if (!this.maxViewPortHeight) this.maxViewPortHeight = this.viewPort.height;
            if (this.maxViewPortHeight && this.maxViewPortHeight < this.viewPort.height) {
                this.maxViewPortHeight = this.viewPort.height;

                var renderedNodesLength = this.renderedNodes.getAll({ order: "asc" }).length;

                while (this.numberOfRenderedItems > renderedNodesLength) {
                    var tail = this.renderedNodes.getHeadAndTail().tail;
                    var index = (<any>angular.element(tail.node).scope()).$$index + 1;

                    var childScope: any = this.scope.$new(true);
                    childScope[this.itemName] = this.collectionManager.items[index];
                    childScope.$$index = index;
                    var itemContent = this.$compile(angular.element(this.template))(childScope);
                    this.container.augmentedJQuery.append(itemContent);

                    var element = itemContent[0];

                    var headY: number = this.getY(element);
                    var tailY: number = this.getY(tail.node);

                    var currentY = this.container.top + headY + element.offsetTop;
                    var desiredY = this.container.top + tailY + tail.node.offsetTop + this.itemHeight;
                    var delta = (desiredY - currentY) + headY;

                    this.transformY(element, delta);
                    renderedNodesLength++;
                }

                this.safeDigest(this.scope);
            }
        }

        public maxViewPortHeight: number;

        public get numberOfRenderedItems() {
            
            if (this.collectionManager.numberOfItems < this.max)
                return this.collectionManager.numberOfItems;

            return this.max;
        }

        public get max() {
            return Math.ceil(((this.viewPort.height * this.renderPageSize) + this.container.htmlElement.offsetTop) / Number(this.itemHeight));
        }

        public hasRendered: boolean = false;

        public calculateItemHeight = (options: any): number => {
            var itemHeight: number;
            if (options.items.length > 0) {
                var childScope: any = this.scope.$new(true);
                childScope[this.itemName] = options.items[0];
                var itemContent = this.$compile(angular.element(this.template))(childScope);
                this.container.augmentedJQuery.append(itemContent);
                itemHeight = itemContent[0].offsetHeight;
                this.container.htmlElement.removeChild(itemContent[0]);
            }
            return itemHeight;
        }

        public get itemName() { return this.attributes[this.controlPrefix + "Of"]; }

        private _itemHeight: number;

        public get itemHeight() {                 
            if (!this._itemHeight && this.collectionManager.items.length > 0)
                this._itemHeight = this.calculateItemHeight({ items: this.collectionManager.items });

            if (!this._itemHeight) return Number(this.attributes[this.controlPrefix + "ItemHeight"]);

            return this._itemHeight;
        }

        public get renderPageSize() { return 1; }

        public get name() { return this.attributes[this.controlPrefix + "Name"]; }

        public element: ng.IAugmentedJQuery;

        public template: string;

        public get scrollEventName() { return this.controlPrefix + "Scroll" + this.name; }

        public get removeItemEventName() { return this.controlPrefix + "RemoveItem" + this.name; }

        public scope: any;
        public lastScrollY: number = 0;
        private collectionManager: ICollectionManager;
        private container: IContainer;
        private viewPort: IViewPort;
        private renderedNodes: IRenderedNodes;
        private attributes: ng.IAttributes;
        private get controlPrefix() { return "virtualFor"; }
    }

    angular.module("virtualFor").service("virtualFor.renderer", ["$compile",
        "$interval",
        "$$rAF",
        "virtualFor.getY",
        "virtualFor.injector",
        "virtualFor.safeDigest",
        "virtualFor.transformY",
        Renderer]);
} 