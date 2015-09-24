/// <reference path="../../../typings/typescriptapp.d.ts" />

module ListDetail {

    angular.module("listDetailApp", [
        "stateResolver",
        "ui.router",
        "virtualIndexedListView"
    ]).config(["$stateProvider", ($stateProvider: ng.ui.IStateProvider) => {
        
        $stateProvider
            .state("default-empty",
                {
                    url: "",
                    templateUrl: "/examples/listDetail/app/views/default.html"
                });

        $stateProvider
            .state("default",
                {
                    url: "/",
                    templateUrl: "/examples/listDetail/app/views/default.html"
                });
    }]);

} 