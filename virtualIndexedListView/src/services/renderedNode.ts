/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    class RenderedNode implements IRenderedNode {
        constructor(private getX: IGetX, private getY: IGetY) { }

        public createInstance = (options: any) => {

            var instance = new RenderedNode(this.getX, this.getY);
            instance.node = options.node;
            return instance;
        }

        public get left() {
            return this.getX(this.node) + this.node.offsetLeft;
        }

        public get right() {
            return this.getX(this.node) + this.node.offsetLeft + this.node.offsetWidth;
        }

        public get top() {
            return this.getY(this.node) + this.node.offsetTop;
        }

        public get bottom() {
            return this.getY(this.node) + this.node.offsetHeight + this.node.offsetTop;
        }

        public node: HTMLElement;

        public get scope() {
            return angular.element(this.node).scope();
        }

        public get $$index() {
            return (<any>this.scope).$$index;
        }

    }

    angular.module("virtualIndexedListView").service("virtualIndexedListView.renderedNode", ["virtualIndexedListView.getX", "virtualIndexedListView.getY", RenderedNode]);
} 