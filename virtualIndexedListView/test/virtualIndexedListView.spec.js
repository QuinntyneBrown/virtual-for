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

//# sourceMappingURL=virtualIndexedListView.spec.js.map