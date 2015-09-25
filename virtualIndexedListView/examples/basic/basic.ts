var basicApp = angular.module("basicApp", ["virtualIndexedListView"]);


module Basic {

    export class AppController {
        constructor(private $scope) {

            
        }
    }

}

basicApp.controller("appController", ["$scope",Basic.AppController]);

