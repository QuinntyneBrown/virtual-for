var app = angular.module("filterApp", ["virtualFor"]);


module Filter {

    export class AppController {

        public movies: Array<any> = [
            { "name": "Matrix" },
            { "name": "This the End" },
            { "name": "Ghostbusters" },
            { "name": "300" },
            { "name": "Top Five" },
            { "name": "Wedding Crashers" },
            { "name": "Mission Impossible 2" },
            { "name": "Despicable Me" },
            { "name": "Her" },
            { "name": "Argo" },
            { "name": "The Two" },
            { "name": "Pain and No Gain" },
            { "name": "The Wedding Ringer" },
            { "name": "The Town" },
            { "name": "Hangover" },
            { "name": "Terminator" },
            { "name": "Avengers" },
            { "name": "The Transporter" },
            { "name": "X-Men 3" },
            { "name": "Fast 7" },
            { "name": "Coming To America" }];

        public filterTerm: string;

        public filterFn = (item: any, searchTerm: string) => {
            return item.name.indexOf(searchTerm) > -1;
        }
    }

}

app.controller("appController", [Filter.AppController]);

