/// <reference path="../typings/typescriptapp.d.ts" />

"use strict";

describe("virtualNodes", () => {

    beforeEach(() => {
        angular.mock.module("virtualIndexedListView");
    });

    var virtualNodes: VirtualIndexedListView.IVirtualNodes;

    beforeEach(inject(($injector: ng.auto.IInjectorService) => {
        virtualNodes = (<VirtualIndexedListView.IVirtualNodes> $injector.get("virtualIndexedListView.virtualNodes"));
    }));

    it("should be defined", () => {
        expect(virtualNodes).toBeDefined();
    });

    it("should be able to create an instance", () => {
        var instance = virtualNodes.createInstance({
            itemHeight: 75,
            items: [{ name: "foo"}],
            numberOfItems: 1,
            numberOfRenderedItems: 1
        });

        expect(instance).toBeDefined();
    });

    it("should be able to create an instance", () => {
        var instance = virtualNodes.createInstance({
            itemHeight: 75,
            items: [{ name: "foo" }],
            numberOfItems: 1,
            numberOfRenderedItems: 1
        });
        var y = instance.getYByRenderedIndexAndScrollY({ renderedNodeIndex: 0, scrollY: 0 });
        var m = instance.map;
        expect(y).toEqual(0);
        expect(instance.pages).toEqual(1);
    });

    it("should be able to create an instance", () => {
        var instance = virtualNodes.createInstance({
            itemHeight: 75,
            items: [{ name: "foo" }, { name: "bar" }, { name: "foo" }],
            numberOfItems: 3,
            numberOfRenderedItems: 2
        });
        var r1 = instance.getYByRenderedIndexAndScrollY({ renderedNodeIndex: 0, scrollY: 0 });

        var r2 = instance.getYByRenderedIndexAndScrollY({ renderedNodeIndex: 1, scrollY: 0 });


        //console.log(JSON.stringify(instance.map[0]));
        //console.log(JSON.stringify(instance.map[1]));
        //console.log(JSON.stringify(instance.map[2]));

        expect(r1).toEqual(0);

        expect(r2).toEqual(0);

        r1 = instance.getYByRenderedIndexAndScrollY({ renderedNodeIndex: 0, scrollY: 75 });

        r2 = instance.getYByRenderedIndexAndScrollY({ renderedNodeIndex: 1, scrollY: 75 });

        console.log(JSON.stringify(instance.map[0]));
        console.log(JSON.stringify(instance.map[1]));
        console.log(JSON.stringify(instance.map[2]));

        expect(r1).toEqual(150);

        expect(r2).toEqual(0);
    });

});