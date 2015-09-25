/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var RenderedNodes = (function () {
        function RenderedNodes(getX, getY) {
            var _this = this;
            this.getX = getX;
            this.getY = getY;
            this.createInstance = function (options) {
                var instance = new RenderedNodes(_this.getX, _this.getY);
                instance.container = options.container;
                return instance;
            };
            this.getAll = function (options) {
                var direction;
                switch (options.orientation) {
                    case "horizontal":
                        direction = "left";
                        break;
                    default:
                        direction = "top";
                        break;
                }
                switch (options.order) {
                    case "desc":
                        return _this.map.sort(function (a, b) {
                            return b[direction] - a[direction];
                        });
                    case "asc":
                        return _this.map.sort(function (a, b) {
                            return a[direction] - b[direction];
                        });
                }
            };
            this.getHead = function () {
                var map = _this.getAll({ order: "asc" });
                if (map.length < 1) {
                    return null;
                }
                return map[0];
            };
            this.getTail = function () {
                var map = _this.getAll({ order: "desc" });
                if (map.length < 1) {
                    return null;
                }
                return map[0];
            };
            this.getHeadAndTail = function () {
                var map = _this.getAll({ order: "asc" });
                if (map.length < 1) {
                    return null;
                }
                return {
                    head: map[0],
                    tail: map[map.length - 1]
                };
            };
        }
        Object.defineProperty(RenderedNodes.prototype, "nodes", {
            get: function () {
                return this.container.htmlElement.childNodes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderedNodes.prototype, "map", {
            get: function () {
                var map = [];
                var nodes = this.nodes;
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    map.push({
                        top: this.getY(node) + node.offsetTop,
                        left: this.getX(node) + node.offsetLeft,
                        right: this.getX(node) + node.offsetLeft + node.offsetWidth,
                        bottom: this.getY(node) + node.offsetTop + node.offsetHeight,
                        index: angular.element(node).scope().$$index,
                        node: node
                    });
                }
                return map;
            },
            enumerable: true,
            configurable: true
        });
        return RenderedNodes;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListView.renderedNodes", ["virtualIndexedListView.getX", "virtualIndexedListView.getY", RenderedNodes]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/renderedNodes.js.map