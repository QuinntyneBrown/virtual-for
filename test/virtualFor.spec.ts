/// <reference path="../typings/typescriptapp.d.ts" />

"use strict";

describe("virtualFor", () => {

    beforeEach(() => {
        angular.mock.module("virtualFor");
    });

    var compile: ng.ICompileService;
    var rootScope: ng.IRootScopeService;
    var scope: ng.IScope;
    var items: any[];

    var template: string = [
        "<Html><div style='height:100px; overflow-y:'scroll'><div",
        "virtual-for='[",
        JSON.stringify({ "name": "Matrix" }),
        "," + JSON.stringify({ "name": "The Wedding Crashers" }),
        "," + JSON.stringify({ "name": "Internship" }),
        "]'",
        "virtual-for-of='movie'",
        "virtual-for-item-height='80'",
        "virtual-for-name='basic'>",
        "<h1 style='height:100px'>{{ movie.name }}</h1>",
    "</div></div></Html>"
    ].join(" ");

    beforeEach(inject(($compile:ng.ICompileService, $rootScope: ng.IRootScopeService) => {
        compile = $compile;
        rootScope = $rootScope;
        scope = $rootScope.$new(true);
    }));

    xit("should be defined", () => {
        var parent = angular.element(template);
        var $element = angular.element(parent[0].children[0]);
        var element = compile($element)(scope);
        rootScope.$digest();
        expect(element).toBeDefined();
    });

});