/// <reference path="../typings/typescriptapp.d.ts" />
describe("virtualIndexedListViewRender", function () {
    var virtualIndexedListViewRenderer;
    beforeEach(function () {
        angular.mock.module("virtualIndexedListView");
    });
    beforeEach(inject(function (_virtualIndexedListViewRenderer_) {
        virtualIndexedListViewRenderer = _virtualIndexedListViewRenderer_;
    }));
    it("should be defined", function () {
        expect(virtualIndexedListViewRenderer).toBeDefined();
    });
});

//# sourceMappingURL=virtualIndexedListViewRenderer.spec.js.map