/// <reference path="../typings/typescriptapp.d.ts" />

"use strict";

describe("virtualList", () => {

    beforeEach(() => {
        angular.mock.module("virtualIndexedListView");
    });

    var compile: ng.ICompileService;
    var rootScope: ng.IRootScopeService;
    var scope: ng.IScope;
    var items: any[];

    var template: string = [
        "<div virtual-indexed-list-view",
         "virtual-indexed-list-view-items='[1,2,3]'",
         "virtual-indexed-list-view-item - name='foo'",
         "virtual-indexed-list-view-collection-name='foos'",
         "virtual-indexed-list-view-item - height='10'>",
        "{{ foo }}",
    "</div>"
    ].join(" ");

    beforeEach(inject(($compile:ng.ICompileService, $rootScope: ng.IRootScopeService) => {
        compile = $compile;
        rootScope = $rootScope;
        scope = $rootScope.$new(true);
    }));

    it("should be defined", () => {
        var linkFn = compile(angular.element(template));
        var content = linkFn(scope);
        expect(content).toBeDefined();
    });


});