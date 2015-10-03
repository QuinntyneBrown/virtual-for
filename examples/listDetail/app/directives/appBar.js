/// <reference path="../../../../typings/typescriptapp.d.ts" />
var ListDetail;
(function (ListDetail) {
    "use strict";
    var AppBar = (function () {
        function AppBar() {
            this.restrict = "E";
            this.replace = true;
            this.templateUrl = "/examples/listDetail/app/directives/appBar.html";
            this.scope = {};
            this.link = function () {
            };
        }
        AppBar.createInstance = function () {
            return new AppBar();
        };
        return AppBar;
    })();
    angular.module("listDetailApp").directive("appBar", [AppBar.createInstance]);
})(ListDetail || (ListDetail = {}));
//# sourceMappingURL=appBar.js.map