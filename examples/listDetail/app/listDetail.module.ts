﻿/// <reference path="../listdetail.d.ts" />

module ListDetail {

    angular.module("listDetailApp", [
            "stateResolver",
            "ui.router",
            "busy",
            "dataService",
            "virtualFor"
        ]).config([
            "$stateProvider", ($stateProvider: ng.ui.IStateProvider) => {

                $stateProvider
                    .state("default-empty",
                    {
                        url: "",
                        templateUrl: "/examples/listDetail/app/views/default.html",
                        resolve: { routeData: [
                                "stateResolver", (stateResolver: StateResolver.IStateResolver) => {
                                    return stateResolver.resolve("default");
                                }
                            ]},
                        controller: "mobileListDetailController",
                        controllerAs: "vm"
                    });

                $stateProvider
                    .state("default",
                    {
                        url: "/",
                        templateUrl: "/examples/listDetail/app/views/default.html",
                        resolve: [
                            "stateResolver", (stateResolver: StateResolver.IStateResolver) => {
                                return stateResolver.resolve("default");
                            }
                        ],
                        controller: "mobileListDetailController",
                        controllerAs: "vm"
                    });
            }
        ])
        .config(["statePromiseProvider", "stateResolverProvider", (statePromiseProvider: StateResolver.IStatePromiseProvider, stateResolverProvider: StateResolver.IStateResolverProvider) => {

            stateResolverProvider.configure({
                priority: 0,
                state: "default",
                key: "list",
                promise: ["$q", "dataService", ($q: ng.IQService, dataService: DataService.IDataService) => {
                    var deferred = $q.defer();

                    dataService.fromService({ method: "GET", url: "http://stats.nba.com/stats/commonallplayers?IsOnlyCurrentSeason=0&LeagueID=00&Season=2015-16" }).then((results: any) => {
                        deferred.resolve(results.data);
                    });

                    return deferred.promise;
                }]
            });

        }
        ]);

} 