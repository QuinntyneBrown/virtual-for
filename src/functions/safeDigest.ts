/// <reference path="../../typings/typescriptapp.d.ts" />

module VirtualFor {

    export var safeDigest: ISafeDigestFn = (scope:ng.IScope) => {
        if (!scope.$$phase && !scope.$root.$$phase)
            scope.$digest();
    }

    angular.module("virtualFor").value("virtualFor.safeDigest", safeDigest);
} 