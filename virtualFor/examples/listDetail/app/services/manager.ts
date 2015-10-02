/// <reference path="../../../../typings/typescriptapp.d.ts" />

module ListDetail {
    
    export class Manager {
        constructor() { }

        
        public clickedItem: any;

    }

    angular.module("listDetail").service("manager", [Manager]);
}

 