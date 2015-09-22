/// <reference path="../typings/typescriptapp.d.ts" />

"use strict";

describe("viewPort", () => {

    beforeEach(() => {
        angular.mock.module("virtualIndexedListView");
    });

    var viewPort: VirtualIndexedListView.IViewPort;

    beforeEach(inject(($injector: ng.auto.IInjectorService) => {
        viewPort = (<VirtualIndexedListView.IViewPort> $injector.get("virtualIndexedListView.viewPort"));
    }));

    it("should be defined", () => {
        expect(viewPort).toBeDefined();
    });


});