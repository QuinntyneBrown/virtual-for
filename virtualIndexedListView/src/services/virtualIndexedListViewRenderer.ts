/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    "use strict";
    
    class VirtualIndexedListViewRenderer implements IVirtualIndexedListViewRenderer {
        constructor(private $compile: ng.ICompileService,
            private $interval: ng.IIntervalService,
            private getScrollDirection:any,
            private getY: IGetY,
            private injector: IInjector,
            private transformY: ITransformY) {

        }

        public createInstance = (options: any) => {
            var instance = new VirtualIndexedListViewRenderer(this.$compile, this.$interval, this.getScrollDirection, this.getY, this.injector, this.transformY);
            instance.itemName = options.itemName;
            instance.scope = options.scope;
            instance.element = options.element;
            instance.template = options.template;
            instance.itemHeight = Number(options.itemHeight);
            instance.name = options.name;

            instance.viewPort = this.injector.get({ interface: "IViewPort", element: instance.element });
            instance.container = this.injector.get({ interface: "IContainer", element: instance.element });
            instance.collectionManager = this.injector.get({ interface: "ICollectionManager", element: instance.element, scope: options.scope, searchTermNameOnScope: options.searchTermNameOnScope, filterFnNameOnVm: options.filterFnNameOnVm, items: options.items, dataService: options.dataService });
            instance.renderedNodes = this.injector.get({ interface: "IRenderedNodes", container: instance.container });

            if (instance.collectionManager.type == collectionType.lazyLoad) {
                instance.$interval(() => {
                    (<ILazyLoadCollectionManager>instance.collectionManager).loadMore();
                }, 1000, null, false);
            }

            instance.scope.$on(instance.scrollEventName, (event:any, criteria:any) => {
                instance.collectionManager.getIndexByCriteriaAsync({ criteria: criteria }).then((result: any) => {
                    instance.viewPort.scrollTo(result.index * instance.itemHeight);
                });
            });

            instance.collectionManager.subscribe({
                callback: () => {
                    instance.forceRender({
                        viewPortHeight: instance.viewPort.height
                    });
                }
            });

            instance.container.setHeight(instance.collectionManager.numberOfItems * instance.itemHeight);

            instance.$interval(() => {
                instance.render({
                    scrollY: instance.viewPort.scrollY,
                    lastScrollY: instance.lastYScroll,
                    viewPortHeight: instance.viewPort.height
                });
                instance.lastYScroll = instance.viewPort.scrollY;
            }, 10,null, false);

            return instance;
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

            this.container.reInitialize({ height: this.collectionManager.numberOfItems * this.itemHeight });
            this.initialRender(options);

            if (!this.scope.$$phase && !this.scope.$root.$$phase)
                this.scope.$digest();     
                 
        }

        public initialRender = (options: IRenderOptions) => {
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

            do {
                var headAndTail = this.renderedNodes.getHeadAndTail();
                var tail = headAndTail.tail;
                var head = headAndTail.head;

                if (tail.bottom >= this.container.bottom)
                    reachedBottom = true;

                if (head.bottom >= options.scrollY)
                    allNodesHaveBeenMoved = true;

                if (!reachedBottom && !allNodesHaveBeenMoved)
                    this.moveAndUpdateScope({
                        node: head.node,
                        position: (this.numberOfRenderedItems * this.itemHeight) + this.getY(head.node),
                        index: tail.index + 1,
                        item: this.collectionManager.items[tail.index + 1]
                    });

            } while (!reachedBottom && !allNodesHaveBeenMoved)
        }

        public moveAndUpdateScope = (options:any) => {
            this.transformY(options.node, options.position);
            var scope: any = angular.element(options.node).scope();
            scope[this.itemName] = options.item;
            scope.$$index = options.index;
            scope.$digest();
        }

        public renderUp = (options: IRenderOptions) => {
            var reachedTop = false;
            var allNodesHaveBeenMoved = false;

            do {
                var headAndTail = this.renderedNodes.getHeadAndTail();
                var tail = headAndTail.tail;
                var head = headAndTail.head;

                if (tail.bottom <= this.container.htmlElement.offsetTop + (this.itemHeight * this.numberOfRenderedItems))
                    reachedTop = true;

                if (tail.top <= (this.viewPort.scrollY + this.viewPort.height))
                    allNodesHaveBeenMoved = true;

                if (!reachedTop && !allNodesHaveBeenMoved)
                    this.moveAndUpdateScope({
                        node: tail.node,
                        position: this.getY(tail.node) - (this.numberOfRenderedItems * this.itemHeight),
                        index: head.index - 1,
                        item: this.collectionManager.items[head.index - 1]
                    });

            } while (!reachedTop && !allNodesHaveBeenMoved)       
        }

        public stabilizeRender = (options: IRenderOptions) => {
            var headAndTail = this.renderedNodes.getHeadAndTail();
            var top = headAndTail.head.top;
            var bottom = headAndTail.tail.bottom;

            if (top > options.scrollY) {
                this.renderUp(options);
            }

            if (bottom <= options.scrollY + options.viewPortHeight) {
                this.renderDown(options);
            }
        }

        public hasRendered: boolean = false;

        public element: ng.IAugmentedJQuery;

        public template: string;

        public itemName: string;

        public name: string;

        public get scrollEventName() {
            return "virtualIndexedListViewScroll" + this.name;
        }

        public scope: any;

        public itemHeight: number;

        public lastYScroll: number = 0;

        public get numberOfRenderedItems() {
            var max = Math.ceil((this.viewPort.height + this.container.htmlElement.offsetTop) / Number(this.itemHeight));
            if (this.collectionManager.numberOfItems < max)
                return this.collectionManager.numberOfItems;
            return max;
        }

        public collectionManager: ICollectionManager;

        public container: IContainer;

        private viewPort: IViewPort;

        private renderedNodes: IRenderedNodes;
    }

    angular.module("virtualIndexedListView").service("virtualIndexedListViewRenderer", ["$compile",
        "$interval",
        "virtualIndexedListView.getScrollDirection",
        "virtualIndexedListView.getY",
        "virtualIndexedListView.injector",
        "virtualIndexedListView.transformY", VirtualIndexedListViewRenderer]);
} 