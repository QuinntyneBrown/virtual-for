/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var Container = (function () {
        function Container() {
            this.createInstance = function (options) {
                return new Container();
            };
            this.reInitialize = function () {
            };
        }
        Object.defineProperty(Container.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (value) {
                this._height = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "bottom", {
            get: function () {
                return this._bottom;
            },
            set: function (value) {
                this._bottom = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "top", {
            get: function () {
                return this._top;
            },
            set: function (value) {
                this._top = value;
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
                return this._htmlElement;
            },
            set: function (value) {
                this._htmlElement = value;
            },
            enumerable: true,
            configurable: true
        });
        return Container;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListView.container", [Container]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/container.js.map