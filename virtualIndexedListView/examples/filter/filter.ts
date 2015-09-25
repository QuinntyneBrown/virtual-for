var app = angular.module("filterApp", ["virtualIndexedListView"]);


module Filter {

    export class AppController {

        public filterTerm: string;

        public filterFn = (item: any, searchTerm: string) => {
            return item.name.indexOf(searchTerm) > -1;
        }
    }

}

app.controller("appController", [Filter.AppController]);

