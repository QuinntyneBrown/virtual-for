/// <reference path="../../../../typings/typescriptApp.d.ts" />

module ListDetail {

    "use strict";

    class NavBar {
        constructor() { }

        public static createInstance() {
            return new NavBar();
        }

        public restrict: string = "E";

        public replace: boolean = true;

        public templateUrl: string = "/examples/listDetail/app/directives/navBar.html";

        public scope: any = {

        };

        public link = () => {

        }
    }

    angular.module("listDetailApp").directive("navBar", [NavBar.createInstance]);
} 