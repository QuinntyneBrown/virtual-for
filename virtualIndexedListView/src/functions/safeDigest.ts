/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    export var safeDigest = (options:any) => {

        if (!options.scope.$$phase && !options.scope.$root.$$phase)
            options.scope.$digest();
    }

    angular.module("virtualIndexedListView").value("virtualIndexedListView.safeDigest", safeDigest);
} 