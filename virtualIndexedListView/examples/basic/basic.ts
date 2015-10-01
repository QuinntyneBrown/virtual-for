var basicApp = angular.module("basicApp", ["popover","virtualIndexedListView"]);


module Basic {

    export class AppController {
        constructor(private $scope) {

            
        }
    }

}

basicApp.controller("appController", ["$scope",Basic.AppController]);

