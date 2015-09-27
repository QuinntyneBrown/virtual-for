/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    class VirtualNodes implements IVirtualNodes  {
        constructor() { }

        public createInstance = (options: IVirtualNodesInstanceOptions) => {
            var instance = new VirtualNodes();
            instance.numberOfRenderedItems = options.numberOfRenderedItems;
            instance.items = options.items;
            instance.numberOfItems = options.numberOfItems;
            instance.itemHeight = options.itemHeight;
            return instance;
        }

        public numberOfRenderedItems: number;

        public itemHeight: number;

        public items: Array<any>;

        public numberOfItems: number;

        public get map(): Array<any> {
            var map: Array<any> = [];
            var renderedNodeIndex = 0;
            for (var i = 0; i < this.items.length; i++) {

                var pageIndex = this.getPageIndex({ index: i });
                var minScrollYThreshold = this.itemHeight + ((pageIndex) * this.itemHeight);

                map.push({
                    index: i,
                    y: (pageIndex) * (this.numberOfRenderedItems * this.itemHeight),
                    renderedNodeIndex: renderedNodeIndex,
                    pageIndex: pageIndex,
                    maxScrollYThreshold: ((pageIndex + 1) * this.itemHeight) + (this.itemHeight * renderedNodeIndex)
                });

                renderedNodeIndex++;

                if (renderedNodeIndex == this.numberOfRenderedItems)
                    renderedNodeIndex = 0;
            }

            return map;
        }

        public getYByRenderedIndexAndScrollY = (options:any) => {
            var y:any = null;

            for (var i = 0; i < this.map.length; i++) {

                var map = this.map[i];

                if (map.renderedNodeIndex == options.renderedNodeIndex && options.scrollY <= map.maxScrollYThreshold) {
                    if(y == null)
                        y = map.y;
                }   
            }

            return y;
        }

        public get pages(): number {
            return Math.ceil(this.numberOfItems / this.numberOfRenderedItems);
        } 

        public getPageIndex = (options: any) => {
            return Math.floor(options.index / this.numberOfRenderedItems);
        }
    }

    angular.module("virtualIndexedListView").service("virtualIndexedListView.virtualNodes", [VirtualNodes]);
} 