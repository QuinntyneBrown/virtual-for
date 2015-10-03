/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualFor {

    export var getX: IGetX = (element: HTMLElement): number => {
        var transform = angular.element(element).css("transform");
        if (transform === "none") return 0;
        return JSON.parse(transform.replace(/^\w+\(/, "[").replace(/\)$/, "]"))[6];
    }
    angular.module("virtualFor").value("virtualFor.getX", getX);

}