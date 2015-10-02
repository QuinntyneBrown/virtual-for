/// <reference path="../typings/typescriptapp.d.ts" />

"use strict";

describe("container", () => {

    beforeEach(() => {
        angular.mock.module("virtualFor");
    });

    var container: VirtualFor.IContainer;
    var $compile: ng.ICompileService;
    var $rootScope: ng.IRootScopeService;

    beforeEach(inject((_$compile_:ng.ICompileService,$injector: ng.auto.IInjectorService,_$rootScope_:ng.IRootScopeService) => {
        container = (<VirtualFor.IContainer> $injector.get("virtualFor.container"));
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it("should be defined", () => {
        expect(container).toBeDefined();
    });

    it("should be able to create instance", () => {
        var element = angular.element("<div></div>");
        var instance = container.createInstance({ element: element });
        expect(instance).toBeDefined();
    });

    it("should be able to change the height of the container", () => {
        var element = angular.element("<div></div>");
        var instance = container.createInstance({ element: element });
        instance.setHeight(100);
        var height = instance.augmentedJQuery.css("height");
        expect(height).toEqual("100px");
    });

    it("should destroy all child scopes and have 0 child elements on reInitialize", () => {
        var elements = [];
        var childScopes = [];
        var element = angular.element("<div></div>");
        var instance = container.createInstance({ element: element });

        for (var i = 0; i < 3; i++) {
            var childScope = $rootScope.$new();
            childScopes.push(childScope);
            spyOn(childScope, "$destroy");
            instance.augmentedJQuery.append($compile("<div></div>")(childScope));
        }

        expect(instance.htmlElement.childNodes.length).toEqual(3);
        instance.reInitialize({ height: 100 });
        expect(instance.htmlElement.childNodes.length).toEqual(0);
        expect(childScopes[0].$destroy).toHaveBeenCalled();
        expect(childScopes[1].$destroy).toHaveBeenCalled();
        expect(childScopes[2].$destroy).toHaveBeenCalled();

    });

});