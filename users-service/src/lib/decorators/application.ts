import express, { Application, Router, RequestHandler } from "express";
import Debug, { IDebugger } from "debug";


let debug: IDebugger;

let app: Application;

let middleware: Function[] = [];

export const Run = function Run(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    target[propertyKey]();
    debug = debug || Debug(`${process.env.NODE_NAME}`);
    debug(`Running: ${target.constructor.name}.${propertyKey}()`);
};

export const AppInit = function AppInit(apptarget: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
    descriptor.value = new Proxy(descriptor.value, {
        apply(target: Function, thisArg: any, argArray?: any): any {
            thisArg.app = express();
            app = thisArg.app;

            let fn = target.apply(thisArg, argArray);

            if (middleware.length) {
                thisArg.app.use(middleware);
            }

            return fn;
        }
    });
};

export const Middleware = function Middleware<T extends { new(...args: any[]): {} }>(constructor: T) {
    let props: string[] = Object.getOwnPropertyNames(constructor.prototype);

    props.forEach((value) => {
        if (value !== "constructor") {
            middleware.push(constructor.prototype[value]);
        }
    });
};

export const Presenter = function Middleware(path: string) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        constructor.prototype.baserouter = Router();
        constructor.prototype.router = Router();
        constructor.prototype.baserouter.use(path, constructor.prototype.router);
        constructor.prototype.methods.forEach((method: {method: string; path: string; handler: RequestHandler}) => constructor.prototype.router[method.method](method.path, method.handler));
        middleware.push(constructor.prototype.baserouter)
    }
};

export const Method = function Method(method: string, path: string) {
    return function (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
        target.methods = target.methods || [];
        target.methods.push({method, path, handler: descriptor.value})
    };
};
