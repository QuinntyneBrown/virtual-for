/// <reference path="../../../typings/typescriptapp.d.ts" />
var ListDetail;
(function (ListDetail) {
    angular.module("listDetailApp", [
        "stateResolver",
        "ui.router",
        "busy",
        "dataService",
        "virtualFor"
    ]).config([
        "$stateProvider",
        function ($stateProvider) {
            $stateProvider.state("default-empty", {
                url: "",
                templateUrl: "/examples/listDetail/app/views/default.html",
                resolve: { routeData: [
                    "stateResolver",
                    function (stateResolver) {
                        return stateResolver.resolve("default");
                    }
                ] },
                controller: "mobileListDetailController",
                controllerAs: "vm"
            });
            $stateProvider.state("default", {
                url: "/",
                templateUrl: "/examples/listDetail/app/views/default.html",
                resolve: [
                    "stateResolver",
                    function (stateResolver) {
                        return stateResolver.resolve("default");
                    }
                ],
                controller: "mobileListDetailController",
                controllerAs: "vm"
            });
        }
    ]).config(["statePromiseProvider", "stateResolverProvider", function (statePromiseProvider, stateResolverProvider) {
        stateResolverProvider.configure({
            priority: 0,
            state: "default",
            key: "list",
            promise: ["$q", "dataService", function ($q, dataService) {
                var deferred = $q.defer();
                dataService.fromService({ method: "GET", url: "http://api.shomi.com/tvseries/search" }).then(function (results) {
                    deferred.resolve(results.data);
                });
                return deferred.promise;
            }]
        });
    }]);
})(ListDetail || (ListDetail = {}));
//# sourceMappingURL=listDetail.module.js.map