/// <reference path="../../../../typings/typescriptapp.d.ts" />
var ListDetail;
(function (ListDetail) {
    "use strict";
    var MobileListDetailController = (function () {
        function MobileListDetailController(routeData) {
            this.routeData = routeData;
        }
        Object.defineProperty(MobileListDetailController.prototype, "list", {
            get: function () {
                return this.routeData.list.Data;
            },
            enumerable: true,
            configurable: true
        });
        return MobileListDetailController;
    })();
    angular.module("listDetailApp").controller("mobileListDetailController", ["routeData", MobileListDetailController]);
})(ListDetail || (ListDetail = {}));
//# sourceMappingURL=mobileListDetailVController.js.map