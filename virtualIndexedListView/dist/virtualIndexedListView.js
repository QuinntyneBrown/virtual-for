/// <reference path="../typings/typescriptapp.d.ts" />
angular.module("virtualIndexedListView", ["rx"]);

//# sourceMappingURL=virtualIndexedListView.module.js.map
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView_1) {
    var VirtualIndexedListView = (function () {
        function VirtualIndexedListView(getHtml, virtualIndexedListViewManager) {
            var _this = this;
            this.getHtml = getHtml;
            this.virtualIndexedListViewManager = virtualIndexedListViewManager;
            this.restirct = "A";
            this.transclude = 'element';
            this.scope = false;
            this.compile = function (template) {
                var virtualIndexedListViewManager = _this.virtualIndexedListViewManager;
                var parentElement = template.parent();
                var getHtml = _this.getHtml;
                return function (scope, element, attributes, controller, transclude) {
                    transclude(scope.$new(), function (clone) {
                        var items = getItems(attributes, scope);
                        removeVirtualListCustomAttributes(clone);
                        virtualIndexedListViewManager.createInstance({
                            element: angular.element(parentElement),
                            template: getHtml(clone[0], true),
                            scope: scope,
                            items: items,
                            itemName: attributes["virtualIndexedListViewItemName"],
                            itemHeight: attributes["virtualIndexedListViewItemHeight"],
                            window: window
                        }).render();
                    });
                };
                function getItems(attributes, scope) {
                    if (attributes["virtualIndexedListViewItems"]) {
                        return JSON.parse(attributes["virtualIndexedListViewItems"]);
                    }
                    else {
                        return scope[attributes["virtualIndexedListViewCollectionName"]];
                    }
                }
                function removeVirtualListCustomAttributes(clone) {
                    clone[0].removeAttribute("virtual-indexed-list-view");
                    clone[0].removeAttribute("virtual-indexed-list-view-collection-name");
                    clone[0].removeAttribute("virtual-indexed-list-view-item-name");
                    clone[0].removeAttribute("virtual-indexed-list-view-item-height");
                    clone[0].removeAttribute("virtual-indexed-list-view-items");
                }
            };
        }
        VirtualIndexedListView.createInstance = function (getHtml, virtualIndexedListViewManager) {
            return new VirtualIndexedListView(getHtml, virtualIndexedListViewManager);
        };
        return VirtualIndexedListView;
    })();
    VirtualIndexedListView_1.VirtualIndexedListView = VirtualIndexedListView;
    angular.module("virtualIndexedListView").directive("virtualIndexedListView", ["getHtml", "virtualIndexedListViewManager", VirtualIndexedListView.createInstance]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../directives/virtualIndexedListView.js.map
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    "use strict";
    var getHtml = function (who, deep) {
        if (!who || !who.tagName)
            return '';
        var txt, ax, el = document.createElement("div");
        el.appendChild(who.cloneNode(false));
        txt = el.innerHTML;
        if (deep) {
            ax = txt.indexOf('>') + 1;
            txt = txt.substring(0, ax) + who.innerHTML + txt.substring(ax);
        }
        el = null;
        return txt;
    };
    angular.module("virtualIndexedListView").value("getHtml", getHtml);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../values/getHtml.js.map
/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    var VirtualIndexedListViewManager = (function () {
        function VirtualIndexedListViewManager($injector, $timeout) {
            var _this = this;
            this.$injector = $injector;
            this.$timeout = $timeout;
            this.createInstance = function (options) {
                var instance = new VirtualIndexedListViewManager(_this.$injector, _this.$timeout);
                instance.element = options.element;
                instance.scope = options.scope;
                instance.template = options.template;
                var virtualIndexedListViewRenderer = _this.$injector.get("virtualIndexedListViewRenderer");
                instance.virtualIndexedListViewRenderer = virtualIndexedListViewRenderer.createInstance({
                    containerHeight: options.items.length * 10,
                    items: options.items,
                    itemName: options.itemName,
                    itemHeight: options.itemHeight,
                    element: options.element,
                    scope: options.scope,
                    template: options.template
                });
                instance.elementCSS = options.window.getComputedStyle(instance.element[0], null);
                if (instance.elementCSS && instance.elementCSS.overflowY && (instance.elementCSS.overflowY == "auto" || instance.elementCSS.overflowY == "scroll")) {
                    instance.element[0].addEventListener("scroll", instance.debouceRender);
                }
                options.window.addEventListener("mousewheel", instance.debouceRender);
                options.window.addEventListener("scroll", instance.debouceRender);
                options.window.addEventListener("resize", instance.debouceRender);
                return instance;
            };
            this.render = function (options) {
                _this.virtualIndexedListViewRenderer.render({});
            };
            this.debouceRender = function () {
                _this.$timeout.cancel(_this.timer);
                _this.timer = _this.$timeout(function () {
                    _this.render({});
                }, 250, false);
            };
        }
        return VirtualIndexedListViewManager;
    })();
    angular.module("virtualIndexedListView").service("virtualIndexedListViewManager", ["$injector", "$timeout", VirtualIndexedListViewManager]);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));

//# sourceMappingURL=../services/virtualIndexedListViewManager.js.map
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

//# sourceMappingURL=../services/virtualIndexedListViewRenderer.js.map