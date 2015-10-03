/// <reference path="../../typings/tsd.d.ts" />

declare module DataService {

    export interface ILocalStorageService {
        set(key: string, value: any): any;
        get(key: string): any;
        remove(key: string): boolean;
        clearAll(): void;

        bind($scope: ng.IScope, key: string, opts?: {
            defaultValue?: any;
            storeName?: string;
        }): any;
        unbind($scope: ng.IScope, key: string, storeName?: string): void;
    }

    export interface IStorage {
        put(params: INameValuePair): void;
        get(): any;
        getByName(params: INameValuePair): any;
    }

    export interface INameValuePair {
        category?: string;
        name: string;
        value?: any;
    }

    export interface ISessionStorageProperty {
        instance?(name: string, initialValue?: any): ISessionStorageProperty;
        get(): any;
        set(value: any, limit?: number): void;
        push?(value: any): void;
    }

    export interface IStorageProperty {
        instance?(name: string, initialValue?: any): IStorageProperty;
        data?: any;
        get(): any;
        set(value: any, limit?: number): void;
        push?(value: any): void;
    }

    export interface IStorageArrayProperty {
        instance?(name: string): IStorageProperty;
        data?: any;
        get(): any;
        set(value: any): void;
        push(value: any): void;
    }

    export interface ISessionStorageArrayProperty {
        instance?(name: string): IStorageProperty;
        data?: any;
        get(): any;
        set(value: any): void;
        push(value: any): void;
    }

    export interface IStorage {
        put(params: INameValuePair): void;
        get(): any;
        getByName(params: INameValuePair): any;
    }

    export interface IApiEndpointConfig {
        baseUrls: any;
        getBaseUrl(name?: string): string;
    }

    export interface IEndpointDefinition {
        name?: string;
        url: string;
    }

    export interface IApiEndpointProvider extends ng.IServiceProvider {
        configure(baseUrl: string, name?: string): void;
        $get(): any;
    }


    export interface IDataService {
        fromCacheOrService(options: IRequestOptions): ng.IPromise<any>;
        fromService(options: IRequestOptions): ng.IPromise<any>;
        fromInMemoryCacheOrService(options: IRequestOptions): ng.IPromise<any>;
        invalidateCache(cacheKey: string): void;
    }

    export interface IRequestOptions {
        method: string;
        url: string;
        data?: any;
        params?: any;
        key?: string;
        category?: string;
        configuration?: any;
    }




    export interface IFormEncode {
        (data: any): string;
    }

} 