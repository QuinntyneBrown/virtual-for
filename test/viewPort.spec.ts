/// <reference path="../typings/typescriptapp.d.ts" />

"use strict";

describe("viewPort", () => {

    beforeEach(() => {
        angular.mock.module("virtualFor");
    });

    var viewPort: VirtualFor.IViewPort;

    beforeEach(inject(($injector: ng.auto.IInjectorService) => {
        viewPort = (<VirtualFor.IViewPort> $injector.get("virtualFor.viewPort"));
    }));

    it("should be defined", () => {
        expect(viewPort).toBeDefined();
        expect(viewPort instanceof VirtualFor.ViewPort);
    });

    it("should create an instance", () => {
        var element = angular.element("<div><h1>hi!</h1></div>");

        var childElement = angular.element(element[0].children[0]);

        var instance = viewPort.createInstance({ element: childElement });

        expect(instance).toBeDefined();
        expect(instance instanceof VirtualFor.ViewPort).toEqual(true);
    });


});