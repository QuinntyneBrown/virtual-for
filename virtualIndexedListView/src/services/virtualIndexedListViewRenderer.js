/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    "use strict";
    var VirtualIndexedListViewRenderer = (function () {
        function VirtualIndexedListViewRenderer($compile) {
            var _this = this;
            this.$compile = $compile;
            this.createInstance = function (options) {
                var instance = new VirtualIndexedListViewRenderer(_this.$compile);
                instance.containerHeight = options.containerHeight;
                instance.items = options.items;
                instance.itemName = options.itemName;
                instance.scope = options.scope;
                instance.element = options.element;
                instance.template = options.template;
                return instance;
            };
            this.render = function (options) {
                if (_this.hasRendered === false) {
                    var containerElement = angular.element("<div class='container'></div>");
                    containerElement.css("height", _this.containerHeight);
                    for (var i = 0; i < _this.items.length; i++) {
                        var childScope = _this.scope.$new(true);
                        childScope[_this.itemName] = _this.items[i];
                        var itemContent = _this.$compile(angular.element(_this.template))(childScope);
                        containerElement.append(itemContent);
                    }
                    _this.element.append(containerElement);
                }
                _this.hasRendered = true;
            };
            this.hasRendered = false;
        }
        return VirtualIndexedListViewRenderer;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListViewRenderer", ["$compile", VirtualIndexedListViewRenderer]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));
//# sourceMappingURL=virtualIndexedListViewRenderer.js.map