/// <reference path="../typings/typescriptapp.d.ts" />
"use strict";
describe("getY", function () {
    beforeEach(function () {
        angular.mock.module("virtualIndexedListView");
    });
    var getY;
    beforeEach(inject(function ($injector) {
        getY = $injector.get("virtualIndexedListView.getY");
    }));
    it("should be defined", function () {
        expect(getY).toBeDefined();
    });
});

//# sourceMappingURL=getY.spec.js.map