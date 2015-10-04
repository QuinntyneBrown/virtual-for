var basicApp = angular.module("basicApp", ["virtualFor"]);
var Basic;
(function (Basic) {
    var AppController = (function () {
        function AppController($scope) {
            this.$scope = $scope;
        }
        return AppController;
    })();
    Basic.AppController = AppController;
})(Basic || (Basic = {}));
basicApp.controller("appController", ["$scope", Basic.AppController]);
//# sourceMappingURL=basic.js.map