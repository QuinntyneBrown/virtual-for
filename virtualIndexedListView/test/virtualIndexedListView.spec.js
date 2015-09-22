/// <reference path="../typings/typescriptapp.d.ts" />
"use strict";
describe("virtualIndexedListView", function () {
    beforeEach(function () {
        angular.mock.module("virtualIndexedListView");
    });
    var compile;
    var rootScope;
    var scope;
    var items;
    var template = [
        "<div virtual-indexed-list-view",
        "virtual-indexed-list-view-items='[1,2,3]'",
        "virtual-indexed-list-view-item-name='foo'",
        "virtual-indexed-list-view-collection-name='foos'",
        "virtual-indexed-list-view-item-height='10'>",
        "{{ foo }}",
        "</div>"
    ].join(" ");
    beforeEach(inject(function ($compile, $rootScope) {
        compile = $compile;
        rootScope = $rootScope;
        scope = $rootScope.$new(true);
    }));
});

//# sourceMappingURL=virtualIndexedListView.spec.js.map