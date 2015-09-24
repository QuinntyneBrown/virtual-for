/// <reference path="../../../typings/typescriptapp.d.ts" />
var ListDetail;
(function (ListDetail) {
    angular.module("listDetailApp", [
        "stateResolver",
        "ui.router",
        "virtualIndexedListView"
    ]).config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("default-empty", {
            url: "",
            templateUrl: "/examples/listDetail/app/views/default.html"
        });
        $stateProvider.state("default", {
            url: "/",
            templateUrl: "/examples/listDetail/app/views/default.html"
        });
    }]);
})(ListDetail || (ListDetail = {}));
//# sourceMappingURL=listDetail.module.js.map