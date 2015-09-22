/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var ViewPort = (function () {
        function ViewPort($window) {
            var _this = this;
            this.$window = $window;
            this.createInstance = function (options) {
                var instance = new ViewPort(_this.$window);
                instance.element = options.element;
                return instance;
            };
        }
        Object.defineProperty(ViewPort.prototype, "scrollY", {
            get: function () {
                if (this.element.css("overflowY") == "scroll")
                    return this.element[0].scrollTop;
                return this.$window.pageYOffset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewPort.prototype, "height", {
            get: function () {
                if (this.element.css("overflowY") == "scroll")
                    return this.element[0].offsetHeight;
                return this.$window.innerHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewPort.prototype, "bottom", {
            get: function () {
                return this.scrollY + this.height;
            },
            enumerable: true,
            configurable: true
        });
        return ViewPort;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListView.viewPort", ["$window", ViewPort]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/viewPort.js.map