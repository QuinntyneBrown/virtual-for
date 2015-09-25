/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var Container = (function () {
        function Container(getY) {
            var _this = this;
            this.getY = getY;
            this.createInstance = function (options) {
                var instance = new Container(_this.getY);
                var container = angular.element("<div class='container'></div>");
                options.element.append(container);
                instance.augmentedJQuery = options.element.find(".container");
                return instance;
            };
            this.reInitialize = function (options) {
                for (var i = 0; i < _this.htmlElement.children.length; i++) {
                    var oldScope = angular.element(_this.htmlElement.children[i]).scope();
                    oldScope.$destroy();
                }
                _this.htmlElement.innerHTML = "";
                _this.setHeight(options.height);
            };
            this.setHeight = function (value) {
                _this.augmentedJQuery.css("height", value);
            };
            this.isNodeAtBottom = function (options) {
                var nodeBottom = _this.getY(options.node) + options.node.offsetTop + options.node.offsetTop;
                return nodeBottom === _this.height;
            };
            this.isNodeAtTop = function (options) {
                var nodeTop = _this.getY(options.node) + options.node.offsetTop;
                return nodeTop === _this.top;
            };
        }
        Object.defineProperty(Container.prototype, "height", {
            get: function () {
                return this.htmlElement.offsetHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "bottom", {
            get: function () {
                return this.htmlElement.offsetHeight + this.htmlElement.offsetTop;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "top", {
            get: function () {
                return this.htmlElement.offsetTop;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "augmentedJQuery", {
            get: function () {
                return this._augmentedJQuery;
            },
            set: function (value) {
                this._augmentedJQuery = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "htmlElement", {
            get: function () {
                return this.augmentedJQuery[0];
            },
            enumerable: true,
            configurable: true
        });
        return Container;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListView.container", ["virtualIndexedListView.getY", Container]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/container.js.map