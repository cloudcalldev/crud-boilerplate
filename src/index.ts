// This is the root file for the whole application
// The application is imported and served using submitted arguments
import * as bunyan from "bunyan";
import { Application as EApplication } from "express";
import { argv } from "yargs";
import { Configuration, Logger } from "./lib";

// Get credentials first then serve the application
Configuration.getCredentials().then(() => {
    const logger: bunyan = Logger.getInstance();
    logger.debug("Configuration Loaded successfully.");

    // CLI Arguments
    const DEFAULT_PORT: number = 1337;
    const PORT: number = argv.port || DEFAULT_PORT;
    const HOST: string = argv.host || "0.0.0.0";

    const application = require("./lib/application").Application;
    const app: EApplication = application.getInstance();
    const httpServer = app.listen(PORT, HOST, () => logger.info(`Serving application on http://${HOST}:${PORT}`));

    const terminateConnection = () => {
        try {
            if (httpServer) {
                httpServer.close();
            }
        } catch (err) {
            logger.error(err);
        }
    };

    process.on("exit", terminateConnection);
    process.on("unhandledRejection", terminateConnection);
    process.on("uncaughtException", terminateConnection); // unexpected crash
    process.on("SIGINT", terminateConnection); // Ctrl + C (1)

}).catch((error: any) => console.error("Could not load configuration so can not start the application", error));
