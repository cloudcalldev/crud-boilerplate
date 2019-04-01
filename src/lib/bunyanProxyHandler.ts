import * as bunyan from "bunyan";
import { get as getForRequest } from "express-http-context";

/**
 * A proxy handler for bunyan designed to wrap around log method calls and inject a correlationId in to the parameters
 */
export class BunyanProxyHandler implements ProxyHandler<bunyan> {

    private static readonly LOGGER_METHODS: string[] = ["trace", "debug", "info", "warn", "error", "fatal"];
    private static readonly LOG_FIELDS: string[] = ["correlationId"];

    /**
     * Gets the fields to be added to all logs (if present)
     */
    private get additionalLogFields(): any[] | null {

        const fields: any[] = BunyanProxyHandler.LOG_FIELDS.reduce((acc: any, field: string): any => {

            const value: string = getForRequest(field);

            if (value) {
                acc[field] = value;
            }

            return acc;

        }, {});

        return Object.keys(fields).length ? fields : null;

    }

    public get(target: bunyan, propertyKey: string | symbol | number): any {

        // if its a logger method, we need to mess with the params
        if (BunyanProxyHandler.LOGGER_METHODS.includes(propertyKey.toString())) {

            return (...args: any) => {

                // if theres no args, the logger method is being used as a getter
                if (!args.length) {
                    return ((target as any)[propertyKey] as () => any).apply(target, args);
                }

                const additionalLogFields: any[] | null = this.additionalLogFields;

                let argList: any;

                if (!additionalLogFields) {
                    // if theres no correlation id, just perform as normal
                    argList = args;
                } else if (args[0] && args[0] instanceof Error) {
                    // if the first argument is an error, change it to an object containing the error and the correlationId
                    argList = [{ ...additionalLogFields, err: args[0] }].concat(args.slice(1));
                } else if (args[0] && typeof args[0] === "object") {
                    // if the first argument is a fields object, add correlation id to it
                    argList = [{ ...additionalLogFields, ...args[0] }].concat(args.slice(1));
                } else {
                    // else just add our fields object on to the front of the arguments array
                    argList = [additionalLogFields].concat(args);
                }

                return ((target as any)[propertyKey] as () => any).apply(target, argList);

            };

        }

        return (target as any)[propertyKey];

    }

}
