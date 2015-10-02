/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualFor {

    export var transformY = (element: HTMLElement, y: number) => {

        angular.element(element).css({
            "-moz-transform": "translateY(" + y + "px)",
            "-webkit-transform": "translateY(" + y + "px)",
            "-ms-transform": "translateY(" + y + "px)",
            "-transform": "translateY(" + y + "px)"
        });

        return element;
    }

    angular.module("virtualFor").value("virtualFor.transformY", transformY);
} 