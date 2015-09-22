/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    "use strict";

    var getRenderedNodesComputedInfo = (options: any): any[] => {

        var computedInfo: any[] = [];

        for (var i = 0; i < options.renderedNodes.length; i++) {

            var y = options.getY(options.renderedNodes[i]);

            var offsetTop = options.renderedNodes[i].offsetTop;

            var itemHeight = options.itemHeight;

            computedInfo.push({
                top: y + offsetTop,
                bottom: y + offsetTop + itemHeight,
                index: (<any>angular.element(options.renderedNodes[i]).scope()).$$index,
                node: options.renderedNodes[i]
            });
        }

        if (options.desc) {
            computedInfo.sort((a: any, b: any) => {
                return b.top - a.top;
            });
        } else {
            computedInfo.sort((a: any, b: any) => {
                return a.top - b.top;
            });
        }

        return computedInfo;
    }

    angular.module("virtualIndexedListView").value("virtualIndexedListView.getRenderedNodesComputedInfo", getRenderedNodesComputedInfo);
} 