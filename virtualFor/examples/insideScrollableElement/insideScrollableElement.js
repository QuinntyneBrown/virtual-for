var app = angular.module("insideScrollableElementApp", ["virtualFor"]);
var InsideScrollableElement;
(function (InsideScrollableElement) {
    var AppController = (function () {
        function AppController() {
        }
        return AppController;
    })();
    InsideScrollableElement.AppController = AppController;
})(InsideScrollableElement || (InsideScrollableElement = {}));
app.controller("appController", [InsideScrollableElement.AppController]);
//# sourceMappingURL=insideScrollableElement.js.map