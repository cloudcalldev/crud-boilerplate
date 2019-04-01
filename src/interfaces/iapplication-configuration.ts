export interface IApplicationConfiguration {
    name: string;
    version: string;
    environment: string;
    statsd: {
        url: string;
        port?: number;
    };
}
