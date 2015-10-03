/// <reference path="../../../../typings/typescriptapp.d.ts" />
var ListDetail;
(function (ListDetail) {
    "use strict";
    var MobileListDetailController = (function () {
        function MobileListDetailController($scope, manager, routeData) {
            this.$scope = $scope;
            this.manager = manager;
            this.routeData = routeData;
            $scope.$on("listItemClicked", function (event, options) {
                manager.clickedItem = options;
            });
        }
        Object.defineProperty(MobileListDetailController.prototype, "list", {
            get: function () {
                return this.routeData.list.Data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MobileListDetailController.prototype, "listItem", {
            get: function () {
                return this.manager.clickedItem;
            },
            enumerable: true,
            configurable: true
        });
        return MobileListDetailController;
    })();
    angular.module("listDetailApp").controller("mobileListDetailController", ["$scope", "manager", "routeData", MobileListDetailController]);
})(ListDetail || (ListDetail = {}));
//# sourceMappingURL=mobileListDetailController.js.map