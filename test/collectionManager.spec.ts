﻿/// <reference path="../typings/typescriptapp.d.ts" />

"use strict";

describe("collectionManager", () => {

    beforeEach(() => {
        angular.mock.module("virtualFor");
    });

    var collectionManager: VirtualFor.ICollectionManager;
    var $rootScope: ng.IRootScopeService;
 
    beforeEach(inject(($injector: ng.auto.IInjectorService, _$rootScope_: ng.IRootScopeService) => {
        collectionManager = (<VirtualFor.ICollectionManager> $injector.get("virtualFor.collectionManager"));
        $rootScope = _$rootScope_;
    }));

    it("should be defined", () => {
        expect(collectionManager).toBeDefined();
        expect(collectionManager instanceof VirtualFor.CollectionManager).toBeTruthy();
    });

    it("should create an instance", () => {
        var instance = collectionManager.createInstance({ items: [{ name: "Twister" }], numberOfItems: 1 });
        expect(instance).toBeDefined();
        expect(instance instanceof VirtualFor.CollectionManager).toBeTruthy();

        describe("methods", () => {

            it("should return the correct index provided the correct criteria", () => {
                instance.getIndexByCriteriaAsync({ criteria: { key: "name", value: "Twister"} }).then((results: any) => {
                    expect(results).toEqual(0);
                });
                $rootScope.$digest();
            });

            it("should take subscriptions call them back", () => {
                var called = false;
                instance.subscribe({ callback: () => { called = true; }, });
                instance.subscriptions[0].callback();
                expect(called).toEqual(true);
            });
        });
    });

});