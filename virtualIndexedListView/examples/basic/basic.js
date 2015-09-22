var basicApp = angular.module("basicApp", ["virtualIndexedListView"]);
var Basic;
(function (Basic) {
    var AppController = (function () {
        function AppController() {
        }
        return AppController;
    })();
    Basic.AppController = AppController;
})(Basic || (Basic = {}));
basicApp.controller("appController", [Basic.AppController]);
//# sourceMappingURL=basic.js.map