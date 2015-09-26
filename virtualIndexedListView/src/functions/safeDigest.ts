/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualIndexedListView {

    export var safeDigest: ISafeDigestFn = (scope:ng.IScope) => {
        if (!scope.$$phase && !scope.$root.$$phase)
            scope.$digest();
    }

    angular.module("virtualIndexedListView").value("virtualIndexedListView.safeDigest", safeDigest);
} 