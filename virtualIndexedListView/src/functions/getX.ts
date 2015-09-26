/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    export var getX: IGetX = (element: HTMLElement): number => {
        var transform = angular.element(element).css("transform");
        if (transform === "none") return 0;
        return JSON.parse(transform.replace(/^\w+\(/, "[").replace(/\)$/, "]"))[6];
    }
    angular.module("virtualIndexedListView").value("virtualIndexedListView.getX", getX);

}