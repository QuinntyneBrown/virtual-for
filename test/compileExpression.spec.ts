/// <reference path="../typings/typescriptapp.d.ts" />

"use strict";

describe("compileExpression", () => {

    beforeEach(() => {
        angular.mock.module("virtualFor");
    });

    var compileExpression: any;

    beforeEach(inject(($injector: ng.auto.IInjectorService) => {
        compileExpression = (<any> $injector.get("virtualFor.compileExpression"));
    }));

    it("should be defined", () => {
        expect(compileExpression).toBeDefined();
    });

    it("should compile", () => {
        var expression = 'transactions <= 5 and abs(profit) > 20.5';
        var myfilter = compileExpression(expression);
        var result:number = myfilter({ transactions: 3, profit: -40.5 });
        expect(result).toEqual(1);
    });

    it("should handle or case", () => {
        var expression = '(id != null and transactions >= 5 and abs(profit) > 20.5) or (id == null and transactions <= 5 and name.contains("Q"))';
        var myfilter = compileExpression(expression);
        var result: number = myfilter({ transactions: 3, profit: -40.5, id: null, ref: null, name:"Quinn" });
        expect(result).toEqual(1);
    });
});