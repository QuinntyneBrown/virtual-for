/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var RenderedNode = (function () {
        function RenderedNode(getX, getY) {
            var _this = this;
            this.getX = getX;
            this.getY = getY;
            this.createInstance = function (options) {
                var instance = new RenderedNode(_this.getX, _this.getY);
                instance.node = options.node;
                return instance;
            };
        }
        Object.defineProperty(RenderedNode.prototype, "left", {
            get: function () {
                return this.getX(this.node) + this.node.offsetLeft;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderedNode.prototype, "right", {
            get: function () {
                return this.getX(this.node) + this.node.offsetLeft + this.node.offsetWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderedNode.prototype, "top", {
            get: function () {
                return this.getY(this.node) + this.node.offsetTop;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderedNode.prototype, "bottom", {
            get: function () {
                return this.getY(this.node) + this.node.offsetHeight + this.node.offsetTop;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderedNode.prototype, "scope", {
            get: function () {
                return angular.element(this.node).scope();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderedNode.prototype, "$$index", {
            get: function () {
                return this.scope.$$index;
            },
            enumerable: true,
            configurable: true
        });
        return RenderedNode;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListView.renderedNode", ["virtualIndexedListView.getX", "virtualIndexedListView.getY", RenderedNode]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/renderedNode.js.map