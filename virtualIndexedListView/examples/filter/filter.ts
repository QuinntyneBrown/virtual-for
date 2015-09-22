var app = angular.module("filterApp", ["virtualIndexedListView"]);


module Filter {

    export class AppController {

        public filterTerm: string;
    }

}

app.controller("appController", [Filter.AppController]);

