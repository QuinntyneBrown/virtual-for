var app = angular.module("filterApp", ["virtualIndexedListView"]);
var Filter;
(function (Filter) {
    var AppController = (function () {
        function AppController() {
        }
        return AppController;
    })();
    Filter.AppController = AppController;
})(Filter || (Filter = {}));
app.controller("appController", [Filter.AppController]);
//# sourceMappingURL=filter.js.map