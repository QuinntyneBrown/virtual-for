/// <reference path="../typings/typescriptapp.d.ts" />
"use strict";
describe("virtualList", function () {
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
    it("should be defined", function () {
        var linkFn = compile(angular.element(template));
        var content = linkFn(scope);
        expect(content).toBeDefined();
    });
});

//# sourceMappingURL=virtualIndexedListView.spec.js.map
/// <reference path="../typings/typescriptapp.d.ts" />
describe("virtualIndexedListView", function () {
    var virtualIndexedListViewManager;
    beforeEach(function () {
        angular.mock.module("virtualIndexedListView");
    });
    beforeEach(inject(function (_virtualIndexedListViewManager_) {
        virtualIndexedListViewManager = _virtualIndexedListViewManager_;
    }));
    it("should be defined", function () {
        expect(virtualIndexedListViewManager).toBeDefined();
    });
});

//# sourceMappingURL=virtualIndexedListViewManager.spec.js.map