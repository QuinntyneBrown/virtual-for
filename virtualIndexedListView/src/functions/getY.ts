/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    export var getY: IGetY = (element: HTMLElement): number => {
        var transform = angular.element(element).css("transform");
        if (transform === "none") return 0;        
        return JSON.parse(transform.replace(/^\w+\(/, "[").replace(/\)$/, "]"))[5];
    }

    angular.module("virtualIndexedListView").value("virtualIndexedListView.getY", getY);

}