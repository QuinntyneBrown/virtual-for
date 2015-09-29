var app = angular.module("removeItemApp", ["virtualIndexedListView"]);


module RemoveItemApp {

    export class AppController {
        constructor(private $scope) {


        }
    }

}

app.controller("appController", ["$scope", RemoveItemApp.AppController]);

