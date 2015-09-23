/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    "use strict";
    
    class VirtualIndexedListViewRenderer implements IVirtualIndexedListViewRenderer {
        constructor(private $compile: ng.ICompileService,
            private $injector: ng.auto.IInjectorService,
            private $interval: ng.IIntervalService,
            private getRenderedNodesComputedInfo:any,
            private getScrollDirection:any,
            private getY: IGetY,
            private observeOnScope: any,
            private transformY: ITransformY) {

        }

        public createInstance = (options: any) => {
            var instance = new VirtualIndexedListViewRenderer(this.$compile, this.$injector, this.$interval, this.getRenderedNodesComputedInfo, this.getScrollDirection, this.getY, this.observeOnScope, this.transformY);
            instance.itemName = options.itemName;
            instance.scope = options.scope;
            instance.element = options.element;
            instance.template = options.template;
            instance.itemHeight = Number(options.itemHeight);
            instance.viewPort = (<IViewPort>this.$injector.get("virtualIndexedListView.viewPort")).createInstance({ element: instance.element });
            instance.container = (<IContainer>this.$injector.get("virtualIndexedListView.container")).createInstance({ element: instance.element });
            instance.name = options.name;

            if (options.filterFn && options.searchTermNameOnScope) {
                instance.collectionManager = (<IFilterableCollectionManager>this.$injector.get("virtualIndexedListView.filterableCollectionManager")).createInstance({ items: options.items });
            } else if (options.dataService) {
                instance.collectionManager = (<ILazyLoadCollectionManager>this.$injector.get("virtualIndexedListView.lazyLoadCollectionManager")).createInstance({ items: options.items, dataService: options.dataService });

                instance.$interval(() => {
                    (<ILazyLoadCollectionManager>instance.collectionManager).loadMore();
                }, 1000, null, false);

            } else {
                instance.collectionManager = (<ICollectionManager>this.$injector.get("virtualIndexedListView.collectionManager")).createInstance({ items: options.items });
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

            var item = null;

            var index = null;

            do {

                var cachedItemsList = (<any[]>this.getRenderedNodesComputedInfo({ getY: this.getY, renderedNodes: this.container.htmlElement.children, itemHeight: this.itemHeight, desc: false }));

                if (cachedItemsList[cachedItemsList.length - 1].bottom >= this.container.bottom) {
                    reachedBottom = true;
                } else {
                    index = cachedItemsList[cachedItemsList.length - 1].index + 1;
                    item = this.collectionManager.items[index];
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
                    item = this.collectionManager.items[index];
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
            var max = Math.ceil(1380 / Number(this.itemHeight));
            if (this.collectionManager.numberOfItems < max)
                return this.collectionManager.numberOfItems;
            return max;
        }

        public collectionManager: ICollectionManager;

        public container: IContainer;

        private viewPort: IViewPort;
    }

    angular.module("virtualIndexedListView").service("virtualIndexedListViewRenderer", ["$compile",
        "$injector",
        "$interval",
        "virtualIndexedListView.getRenderedNodesComputedInfo",
        "virtualIndexedListView.getScrollDirection",
        "virtualIndexedListView.getY",
        "observeOnScope",
        "virtualIndexedListView.transformY", VirtualIndexedListViewRenderer]);
} 