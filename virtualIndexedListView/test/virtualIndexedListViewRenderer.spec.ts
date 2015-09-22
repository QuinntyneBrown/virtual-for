/// <reference path="../typings/typescriptapp.d.ts" />

describe("virtualIndexedListViewRender", () => {

    var virtualIndexedListViewRenderer: VirtualIndexedListView.IVirtualIndexedListViewRenderer;

    beforeEach(() => {
        angular.mock.module("virtualIndexedListView");
    });

    beforeEach(inject((_virtualIndexedListViewRenderer_: VirtualIndexedListView.IVirtualIndexedListViewRenderer) => {
        virtualIndexedListViewRenderer = _virtualIndexedListViewRenderer_;
    }));

    it("should be defined", () => {
        expect(virtualIndexedListViewRenderer).toBeDefined();
    });

});