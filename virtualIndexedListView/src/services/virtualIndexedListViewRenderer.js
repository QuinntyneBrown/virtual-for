/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    "use strict";
    var VirtualIndexedListViewRenderer = (function () {
        function VirtualIndexedListViewRenderer($compile, $window) {
            var _this = this;
            this.$compile = $compile;
            this.$window = $window;
            this.createInstance = function (options) {
                var instance = new VirtualIndexedListViewRenderer(_this.$compile, _this.$window);
                instance.containerHeight = options.containerHeight;
                instance.items = options.items;
                instance.itemName = options.itemName;
                instance.scope = options.scope;
                instance.element = options.element;
                instance.template = options.template;
                instance.itemHeight = options.itemHeight;
                return instance;
            };
            this.render = function (options) {
                _this.innerHeight = _this.$window.innerHeight;
                var visibleItems = Math.ceil(_this.innerHeight / _this.itemHeight);
                if (_this.hasRendered === false) {
                    var parentNode = _this.element[0].parentNode;
                    var containerElement = angular.element("<div class='container'></div>");
                    containerElement.css("height", _this.containerHeight);
                    _this.element.append(containerElement);
                    var rect = containerElement[0].getBoundingClientRect();
                    for (var i = 0; i < visibleItems; i++) {
                        var childScope = _this.scope.$new(true);
                        childScope[_this.itemName] = _this.items[i];
                        var itemContent = _this.$compile(angular.element(_this.template))(childScope);
                        containerElement.append(itemContent);
                    }
                }
                _this.hasRendered = true;
            };
            this.hasRendered = false;
        }
        return VirtualIndexedListViewRenderer;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListViewRenderer", ["$compile", "$window", VirtualIndexedListViewRenderer]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));
//# sourceMappingURL=virtualIndexedListViewRenderer.js.map