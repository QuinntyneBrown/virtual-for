/// <reference path="../../../../typings/typescriptApp.d.ts" />
var ListDetail;
(function (ListDetail) {
    "use strict";
    var NavBar = (function () {
        function NavBar() {
            this.restrict = "E";
            this.replace = true;
            this.templateUrl = "/examples/listDetail/app/directives/navBar.html";
            this.scope = {};
            this.link = function () {
            };
        }
        NavBar.createInstance = function () {
            return new NavBar();
        };
        return NavBar;
    })();
    angular.module("listDetailApp").directive("navBar", [NavBar.createInstance]);
})(ListDetail || (ListDetail = {}));
//# sourceMappingURL=navBar.js.map