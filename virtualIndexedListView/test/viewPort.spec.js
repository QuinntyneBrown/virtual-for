/// <reference path="../typings/typescriptapp.d.ts" />
"use strict";
describe("viewPort", function () {
    beforeEach(function () {
        angular.mock.module("virtualIndexedListView");
    });
    var viewPort;
    beforeEach(inject(function ($injector) {
        viewPort = $injector.get("virtualIndexedListView.viewPort");
    }));
    it("should be defined", function () {
        expect(viewPort).toBeDefined();
    });
});

//# sourceMappingURL=viewPort.spec.js.map