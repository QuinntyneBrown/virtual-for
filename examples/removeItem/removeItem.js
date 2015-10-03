var app = angular.module("removeItemApp", ["virtualFor"]);
var RemoveItemApp;
(function (RemoveItemApp) {
    var AppController = (function () {
        function AppController($scope) {
            this.$scope = $scope;
        }
        return AppController;
    })();
    RemoveItemApp.AppController = AppController;
})(RemoveItemApp || (RemoveItemApp = {}));
app.controller("appController", ["$scope", RemoveItemApp.AppController]);
//# sourceMappingURL=removeItem.js.map