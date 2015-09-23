var basicApp = angular.module("basicApp", ["virtualIndexedListView"]);


module Basic {

    export class AppController {
        constructor(private $scope) {

            setTimeout(() => {
                $scope.$broadcast("virtualIndexedListViewScrollbasic", { key: "name", value: "Her" });
            }, 1000);
            
        }
    }

}

basicApp.controller("appController", ["$scope",Basic.AppController]);

