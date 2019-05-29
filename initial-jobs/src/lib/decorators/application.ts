import Debug, { IDebugger } from "debug";


let debug: IDebugger;

export const Run = function Run(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    target[propertyKey]();

    debug = debug || Debug(`${process.env.NODE_NAME}`);
    debug(`Running: ${target.constructor.name}.${propertyKey}()`);
};
