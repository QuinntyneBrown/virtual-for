/// <reference path="../../typings/typescriptapp.d.ts" />
var VirtualIndexedListView;
(function (VirtualIndexedListView) {
    VirtualIndexedListView.safeDigest = function (options) {
        if (!options.scope.$$phase && !options.scope.$root.$$phase)
            options.scope.$digest();
    };
    angular.module("virtualIndexedListView").value("virtualIndexedListView.safeDigest", VirtualIndexedListView.safeDigest);
})(VirtualIndexedListView || (VirtualIndexedListView = {}));
//# sourceMappingURL=safeDigest.js.map