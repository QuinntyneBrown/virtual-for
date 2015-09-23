var app = angular.module("serverSidePagingApp", ["virtualIndexedListView"]);
var ServerSidePagingApp;
(function (ServerSidePagingApp) {
    var AppController = (function () {
        function AppController() {
        }
        return AppController;
    })();
    app.controller("appController", [AppController]);
    var DataService = (function () {
        function DataService($http, $q) {
            var _this = this;
            this.$http = $http;
            this.$q = $q;
            this.search = function (options) {
                var deferred = _this.$q.defer();
                _this.$http({ method: "GET", url: "http://api.shomi.com/multisearch/search/", params: options.params }).then(function (results) {
                    deferred.resolve(results);
                }).catch(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
        }
        return DataService;
    })();
    app.service("dataService", ["$http", "$q", DataService]);
})(ServerSidePagingApp || (ServerSidePagingApp = {}));
//# sourceMappingURL=serverSidePaging.js.map