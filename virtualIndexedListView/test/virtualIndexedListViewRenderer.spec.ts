/// <reference path="../typings/typescriptapp.d.ts" />

"use strict";

describe("virtualIndexedListView", () => {

    beforeEach(() => {
        angular.mock.module("virtualIndexedListView");
    });

    var compile: ng.ICompileService;
    var rootScope: ng.IRootScopeService;
    var scope: ng.IScope;
    var items: any[] = [{ name: "Matrix" }, { name: "The Wedding Crashers" }];
    var virtualIndexedListViewRenderer: VirtualIndexedListView.IVirtualIndexedListViewRenderer;
    var $document: ng.IDocumentService;

    var template: string = [
        "<Html><div style='height:100px; overflow-y:'scroll'><div virtual-indexed-list-view",
        "virtual-indexed-list-view-items='[",
        JSON.stringify({ "name": "Matrix" }),
        "," + JSON.stringify({ "name": "The Wedding Crashers" }),
        "," + JSON.stringify({ "name": "Internship" }),
        "]'",
        "virtual-indexed-list-view-item-name='movie'",
        "virtual-indexed-list-view-item-height='80'",
        "virtual-indexed-list-view-name='unit test'>",
        "<h1 style='height:100px'>{{ movie.name }}</h1>",
        "</div></div></Html>"
    ].join(" ");

    beforeEach(inject(($compile: ng.ICompileService, _$document_:ng.IDocumentService, $rootScope: ng.IRootScopeService, _virtualIndexedListViewRenderer_: VirtualIndexedListView.IVirtualIndexedListViewRenderer) => {
        compile = $compile;
        rootScope = $rootScope;
        scope = $rootScope.$new(true);
        $document = _$document_;
        virtualIndexedListViewRenderer = _virtualIndexedListViewRenderer_;
    }));

    it("should be defined", () => {
        expect(virtualIndexedListViewRenderer).toBeDefined();
        expect(virtualIndexedListViewRenderer instanceof VirtualIndexedListView.VirtualIndexedListViewRenderer).toBeTruthy();
    });

    it("should create an instance", () => {

        var prefix = "virtualIndexedListView";
        var style = "height:'1000px';overflow-y:scroll";
        var element = angular.element("<div id='unit test'></div>");
        element[0].style.height = '8px';
        element[0].style.overflowY = 'scroll';
        element[0].style.padding = '0';
        element[0].style.margin = '0';

        angular.element((<any>$document[0]).body).append(element[0]);

        var instance = virtualIndexedListViewRenderer.createInstance({
            attributes: { "virtualIndexedListViewItemName": "movie", "virtualIndexedListViewItemHeight": 10, "virtualIndexedListViewName": "unitTest" },
            items: items,
            element: element,
            scope: scope,
            template: "<h1 style='height:10px'>{{ movie.name }}</h1>"
        });

        expect(instance).toBeDefined();

        var container = element.find(".container")[0];

        expect(container).toBeDefined();

        expect(container.children.length).toEqual(0);

        instance.render({ lastScrollY: 0, scrollY: 0 });

        expect(container.children.length).toEqual(2);

        var itemScope: any = <any>angular.element(container.children[0]).scope();

        expect(itemScope.movie.name).toEqual("Matrix");

    });
});