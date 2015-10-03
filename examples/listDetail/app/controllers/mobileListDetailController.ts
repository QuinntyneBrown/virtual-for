/// <reference path="../../../../typings/typescriptapp.d.ts" />

module ListDetail {

    "use strict";

    class MobileListDetailController {
        constructor(private $scope:any, private manager:any, private routeData: any) {

            $scope.$on("listItemClicked", (event:any, options:any) => {
                manager.clickedItem = options;
            });
        }

        public get list() {
            return this.routeData.list.Data;
        }

        public get listItem() {
            return this.manager.clickedItem;
        }

    }

    angular.module("listDetailApp").controller("mobileListDetailController", ["$scope", "manager", "routeData",MobileListDetailController]);
}  