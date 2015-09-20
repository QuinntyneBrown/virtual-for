/// <reference path="tsd.d.ts" />

declare module VirtualIndexedListView {
    
    export interface IVirtualIndexedListViewManager {
        createInstance(options: any): IVirtualIndexedListViewManager;
        render():void;
    }

    export interface IVirtualIndexedListViewRenderer {
        createInstance(options: any): IVirtualIndexedListViewRenderer;
        render(options:any):void;
    }

    export interface IGetHtmlFn {
        (who: HTMLElement, deep: boolean):string
    }
}