/// <reference path="../typings/typescriptapp.d.ts" />

"use strict";

describe("getY", () => {

    beforeEach(() => {
        angular.mock.module("virtualIndexedListView");
    });

    var getY: VirtualIndexedListView.IGetY;

    beforeEach(inject(($injector: ng.auto.IInjectorService) => {
        getY = (<VirtualIndexedListView.IGetY> $injector.get("virtualIndexedListView.getY"));
    }));

    it("should be defined", () => {
        expect(getY).toBeDefined();
    });


});