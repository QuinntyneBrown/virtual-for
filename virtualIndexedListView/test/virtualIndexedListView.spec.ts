/// <reference path="../typings/typescriptapp.d.ts" />

describe("virtualIndexedListView", () => {

    var virtualIndexedListViewManager: VirtualIndexedListView.IVirtualIndexedListManager;

    beforeEach(() => {
        angular.mock.module("virtualIndexedListView");
    });

    beforeEach(inject((_virtualIndexedListViewManager_:any) => {
        virtualIndexedListViewManager = _virtualIndexedListViewManager_;        
    }));

    it("should be defined", () => {
        expect(virtualIndexedListViewManager).toBeDefined();
    });

});