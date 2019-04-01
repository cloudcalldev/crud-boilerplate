import { Client } from "node-statsd-client";
import { IApplicationConfiguration, IGraphiteController } from "../interfaces";
import { Configuration } from "../lib/configuration";

const PREFIX = Configuration.configuration.name;

export default class GraphiteController implements IGraphiteController {

    private _client: any;
    // the graphite port will always be this for every environment
    private _port: number = 8125;
    private static _instance: GraphiteController;

    // Check if we are running tests, if so, deactive the graphite logging
    private testing: boolean = process.env.NODE_ENV === "testing";

    constructor(config: IApplicationConfiguration) {

        if (!this.testing && config.statsd) {
            try {
                this._client = new Client(config.statsd.url, config.statsd.port || this._port);
            } catch (err) {
                throw new Error(`There was an error connecting to Graphite: ${err}`);
            }
        }
    }

    public static getInstance(config: IApplicationConfiguration): GraphiteController {
        if (!this._instance) {
            this._instance = new GraphiteController(config);
        }
        return this._instance;
    }

    public write(activityType: string, error: boolean = false): void {
        if (!this.testing) {
            this._client.increment(`${PREFIX}.${activityType}${error ? ".error" : ""}`);
        }
    }

    /**
     * Writes a graphite timing
     * This is used to measure the time a function or piece of logic takes
     * @param  {string} activityType
     * @param  {Date} startDate - a new Date() object. Create this as a variable at the top of the function and then pass it in
     * @returns void
     */
    public writeTiming(activityType: string, startDate: Date): void {
        if (!this.testing) {
            this._client.timing(`${PREFIX}.${activityType}`, (new Date().getTime() - startDate.getTime()));
        }
    }

}
