var app = angular.module("filterApp", ["virtualFor"]);
var Filter;
(function (Filter) {
    var AppController = (function () {
        function AppController() {
            this.filterFn = function (item, searchTerm) {
                return item.name.indexOf(searchTerm) > -1;
            };
        }
        return AppController;
    })();
    Filter.AppController = AppController;
})(Filter || (Filter = {}));
app.controller("appController", [Filter.AppController]);
//# sourceMappingURL=filter.js.map