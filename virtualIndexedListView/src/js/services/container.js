/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var Container = (function () {
        function Container() {
            var _this = this;
            this.createInstance = function (options) {
                var instance = new Container();
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
    angular.module("virtualIndexedListView").service("virtualIndexedListView.container", [Container]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/container.js.map