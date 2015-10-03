/// <reference path="../typings/typescriptapp.d.ts" />

"use strict";

describe("getY", () => {

    beforeEach(() => {
        angular.mock.module("virtualFor");
    });

    var getY: VirtualFor.IGetY;

    beforeEach(inject(($injector: ng.auto.IInjectorService) => {
        getY = (<VirtualFor.IGetY> $injector.get("virtualFor.getY"));
    }));

    it("should be defined", () => {
        expect(getY).toBeDefined();
    });


});