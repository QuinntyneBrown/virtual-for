/// <reference path="../tsd.d.ts" />

declare module StateResolver {

    export enum StatePromiseType {
        canActivate,
        activate,
        canDeactivate,
        deactivate
    }

    export interface IStateResolverProvider {
        configure(promise: IStatePromise): void;
    }

    export interface IStateResolver {
        resolve(stateName: string, $stateParams?: ng.ui.IStateParamsService): ng.IPromise<any>;
        registerDeactivation(deactivatableObject: IDeactivatable): void;
        getStateParams(): ng.ui.IStateParamsService;
        deactivate(stateName: string): void;
        activate(stateName: string, $stateParams?: ng.ui.IStateParamsService): void;
    }

    export interface IStateParamsHelper {
        getParams(paramIds: string[], stateUrl?: string): any;
    }

    export interface IDeactivatable {
        canDeactivate?(): boolean;
        deactivate(): ng.IPromise<any>;
    }

    export interface IStatePromise {
        priority: number;
        state?: string;
        states?: Array<string>;
        excludedStates?: string[];
        promise?: any;
        key?: string;
        cancelCallback?: boolean;
        func?: any;
        type?: StatePromiseType;
    }

    export interface IStatePromisesPrioritizedGroup {
        promises: IStatePromise[];
        priority: number;
        isLast: boolean;
    }

} 