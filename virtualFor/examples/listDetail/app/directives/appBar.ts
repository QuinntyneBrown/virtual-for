/// <reference path="../../../../typings/typescriptapp.d.ts" />

module ListDetail {

    "use strict";

    class AppBar {
        constructor() { }

        public static createInstance() {
            return new AppBar();
        }

        public restrict: string = "E";

        public replace: boolean = true;

        public templateUrl: string = "/examples/listDetail/app/directives/appBar.html";

        public scope:any = {
        
        };

        public link = () => {
            
        }
    }

    angular.module("listDetailApp").directive("appBar", [AppBar.createInstance]);
} 