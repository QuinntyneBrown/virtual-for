/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    class RenderedNodes implements IRenderedNodes {
        constructor(private getX: IGetX, private getY: IGetY) { }

        public createInstance = (options: IRenderedNodesInstanceOptions) => {

            var instance = new RenderedNodes(this.getX, this.getY);
            instance.container = options.container;
            return instance;
        }

        private get nodes() {
            return this.container.htmlElement.childNodes;
        }

        public get map() {
            var map = [];

            var nodes = this.nodes;

            for (var i = 0; i < nodes.length; i++) {

                var node = <HTMLElement>nodes[i];

                map.push({
                    top: this.getY(node) + node.offsetTop,
                    left: this.getX(node) + node.offsetLeft,
                    right: this.getX(node) + node.offsetLeft + node.offsetWidth,
                    bottom: this.getY(node) + node.offsetTop + node.offsetHeight,
                    index: (<any>angular.element(node).scope()).$$index,
                    node: node
                });
            }

            return map;
        }

        public getAll = (options:any) => {

            var direction;

            switch(options.orientation) {
                case "horizontal":
                    direction = "left";
                    break;

                default:
                    direction = "top";
                    break;
            }

            switch (options.order) {
                case "desc":
                    return this.map.sort((a: any, b: any) => {
                        return b[direction] - a[direction];
                    });

                case "asc":
                    return this.map.sort((a: any, b: any) => {
                        return a[direction] - b[direction];
                    });
                
            }
        }

        public getHead = () => {
            var map = this.getAll({ order: "asc" });
            if (map.length < 1) { return null; }
            return map[0];
        }

        public getTail = () => {
            var map = this.getAll({ order: "desc" });
            if (map.length < 1) { return null; }
            return map[0];
        }

        public getHeadAndTail = () => {
            var map = this.getAll({ order: "asc" });
            if (map.length < 1) { return null; }
            return {
                head: map[0],
                tail: map[map.length - 1]
            };
        }

        private container: IContainer;

    }

    angular.module("virtualIndexedListView").service("virtualIndexedListView.renderedNodes", ["virtualIndexedListView.getX","virtualIndexedListView.getY",RenderedNodes]);
} 