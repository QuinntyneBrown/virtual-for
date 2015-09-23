/// <reference path="tsd.d.ts" />

declare module VirtualIndexedListView {

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
        scrollY: number;
        lastScrollY: number;
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
    }
}