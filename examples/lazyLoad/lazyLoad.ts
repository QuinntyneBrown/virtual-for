var app = angular.module("lazyLoadApp", ["virtualFor"]); 


module LazyLoad {
    
    class AppController {
        constructor() { }
    }

    app.controller("appController", [AppController]);

    class DataService {
        constructor(private $http:ng.IHttpService, private $q:ng.IQService) { }

        public search = (options: any) => {

            var deferred = this.$q.defer();

            this.$http({ method: "GET", url: "http://api.shomi.com/tvseries/search", params: options.params }).then((results) => {
                deferred.resolve(results);
            }).catch((error) => {
                deferred.reject(error);
            });

            return deferred.promise;
        }
    }

    app.service("dataService", ["$http", "$q",DataService]);
}
