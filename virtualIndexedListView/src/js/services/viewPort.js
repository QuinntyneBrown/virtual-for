/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var ViewPort = (function () {
        function ViewPort($window) {
            var _this = this;
            this.$window = $window;
            this.createInstance = function (options) {
                var instance = new ViewPort(_this.$window);
                instance.scrollableParentElement = instance.getScrollableParent(options.element[0]);
                return instance;
            };
            this.getScrollableParent = function (hTMLElement) {
                if (hTMLElement.tagName == "HTML")
                    return null;
                if (angular.element(hTMLElement).css("overflowY") == "scroll")
                    return angular.element(hTMLElement);
                if (hTMLElement.parentNode)
                    return _this.getScrollableParent(hTMLElement.parentNode);
            };
        }
        Object.defineProperty(ViewPort.prototype, "scrollY", {
            get: function () {
                if (this.scrollableParentElement)
                    return this.scrollableParentElement[0].scrollTop;
                return this.$window.pageYOffset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewPort.prototype, "height", {
            get: function () {
                if (this.scrollableParentElement)
                    return this.scrollableParentElement[0].offsetHeight;
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