var app = angular.module("removeItemApp", ["virtualFor"]);


module RemoveItemApp {

    export class AppController {
        constructor(private $scope) {


        }
    }

}

app.controller("appController", ["$scope", RemoveItemApp.AppController]);

