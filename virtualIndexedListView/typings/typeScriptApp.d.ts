/// <reference path="tsd.d.ts" />

declare module VirtualIndexedListView {

    export interface IFilterableCollectionManager extends ICollectionManager {
        
    }

    export interface IFilterableCollectionManagerInstanceOptions extends ICollectionManagerInstanceOptions {
        scope: any;
        searchTermNameOnScope: string;
        filterFn:any;
    }

    export interface ISubscription {
        id: number;
        callback(options?: any): void;
        isActive: boolean;
    }

    export interface ICollectionManagerInstanceOptions {
        items?: any[];        
    }

    export interface ICollectionManager {
        createInstance(options: ICollectionManagerInstanceOptions): ICollectionManager; 
        numberOfItems: number;
        items: any[];   
        subscribe(options: ISubscribeOptions): number;
        getIndexByCriteriaAsync(options:any):ng.IPromise<any>;
    }

    export interface ISubscribeOptions {
        callback(options?:any): any;
    }

    export interface ISubscriptionCallbackFunction {
        (options?: any):void;
    }

    export interface ISubscriptionCallbackFunctionOptions {
        change:IChange;
    }

    export interface IChange {
        oldValue: any;
        newValue: any;
    }

    export interface IContainer {
        height: number;
        bottom: number;
        top: number;
        augmentedJQuery: ng.IAugmentedJQuery;
        htmlElement: HTMLElement;
        setHeight(value:number):void;
        reInitialize(options:any): void;
        createInstance(options:IContainerInstanceOptions):IContainer;
    }

    export interface IContainerInstanceOptions {
        element: ng.IAugmentedJQuery;
    }

    export interface IMoveToY {
        (element: HTMLElement, y: number): HTMLElement;
    }

    export interface ITransformY {
        (element: HTMLElement, y: number): HTMLElement;
    }

    export interface IGetY {
        (element: HTMLElement): number;
    }

    export interface IRenderOptions {
        scrollY?: number;
        lastScrollY?: number;
        viewPortHeight: number;
        force?: boolean;
        items?:any[];
    }

    export interface IViewPortInstanceOptions {
        element: ng.IAugmentedJQuery;    
    }

    export interface IVirtualIndexedListViewManager {
        createInstance(options: any): IVirtualIndexedListViewManager;
        render():void;
    }

    export interface IVirtualIndexedListViewRenderer {
        createInstance(options: any): IVirtualIndexedListViewRenderer;
        render(options?:any):void;
    }

    export interface IGetHtmlFn {
        (who: HTMLElement, deep: boolean):string
    }

    export interface IViewPort {
        createInstance(options?:any):IViewPort;
        scrollY: number;
        height: number;
        scrollTo(value: number):void;
    }
}