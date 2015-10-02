///// <reference path="../../../../typings/typescriptapp.d.ts" />
//module ListDetail {
//    "use strict";
//    class DataService implements IDataService {
//        constructor(public $http: ng.IHttpService,
//            public $q: ng.IQService,
//            public localStorageService: Common.ILocalStorageService) {
//        }
//        public inMemoryCache: any = {};
//        public fromCacheOrService = (options: IRequestOptions) => {
//            var deferred = this.$q.defer();
//            var cachedData = this.localStorageService.get(this.getCacheKey(options));
//            if (!cachedData) {
//                this.fromService(options).then((results) => {
//                    deferred.resolve(results);
//                }).catch((error: Error) => {
//                    deferred.reject(error);
//                });
//            } else {
//                deferred.resolve(cachedData.value);
//            }
//            return deferred.promise;
//        }
//        public fromInMemoryCacheOrService = (options: IRequestOptions) => {
//            var deferred = this.$q.defer();
//            var cachedData = this.inMemoryCache[this.getCacheKey(options)];
//            if (!cachedData) {
//                this.$http({ method: options.method, url: options.url, data: options.data, params: options.params }).then((results) => {
//                    this.inMemoryCache[this.getCacheKey(options)] = results;
//                    deferred.resolve(results);
//                }).catch((error: Error) => {
//                    deferred.reject(error);
//                });
//            } else {
//                deferred.resolve(cachedData);
//            }
//            return deferred.promise;
//        }
//        public fromService = (options: IRequestOptions) => {
//            var deferred = this.$q.defer();
//            this.$http({ method: options.method, url: options.url, data: options.data, params: options.params }).then((results) => {
//                deferred.resolve(results);
//            }).catch((error) => {
//                deferred.reject(error);
//            });
//            return deferred.promise;
//        }
//        public getCacheKey = (options: IRequestOptions) => {
//            return options.key || options.url + JSON.stringify(options.params) + JSON.stringify(options.data);
//        }
//        public invalidateCache = (cacheKey: string) => {
//            //TODO: Implement
//        }
//    }
//    angular.module("listDetailApp").service("dataService", [DataService]);
//}
//# sourceMappingURL=dataService.js.map