// The main API application instance
// Here middleware are assigned to parse POST data and log request/response info
// Also handlers are assigned for logging and returning errors
import * as bodyParser from "body-parser";
import * as bunyan from "bunyan";
import * as express from "express";
import * as helmet from "helmet";
import { Routes } from "../route";
import { middleware as httpContextMiddleware } from "express-http-context";
import { HttpError, InternalServerError, NotFound } from "http-errors";
import { requireJWTAuth } from "../middleware/authorization.middleware";
import { logHTTP } from "../middleware/logger.middleware";
import { Logger } from "./logger";

const logger: bunyan = Logger.getInstance();

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../../swagger.json");
const path = require("path");

export class Application {
    /**
     * Get/create a singleton HTTP Application instance
     */
    public static getInstance(): express.Application {

        if (this.instance) {
            return this.instance;
        }

        // Create application instance
        this.instance = express();

        // Parse JSON or URL encoded body data, and allow request context
        this.instance.use(bodyParser.json());
        this.instance.use(bodyParser.urlencoded({
            extended: true,
        }));
        this.instance.use(httpContextMiddleware);

        // Add secure headers and remove others
        this.instance.use(helmet());

        const showExplorer = false;
        const options = {};
        let customCss = ".swagger-ui .opblock .opblock-summary-method { background: #875a9d !important; }";
        customCss += " .swagger-ui .opblock  .opblock-summary {background:black !important; border-color: black !important }";
        customCss += " .swagger-ui .opblock .opblock-summary-operation-id, .swagger-ui .opblock .opblock-summary .opblock-summary-path, .swagger-ui .opblock .opblock-summary .opblock-summary-description { color:white !Important; }";
        customCss += " .swagger-ui .opblock  { border: 2px solid #875a9d !Important; }";
        customCss += " .swagger-ui section.models h4 { color:black; }";
        customCss += " .swagger-ui .topbar{ background: #f4f4f4 }";
        customCss += " .swagger-ui .opblock  .opblock-summary-path, .swagger-ui .opblock  .opblock-summary-description { color: black !Important; }";
        customCss += " .swagger-ui .opblock { background-color: #f4eff5 !Important;}";
        this.instance.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, showExplorer, options, customCss, "/favicon.png", null, "cloudcall API documents"));

        // Log request/response middleware
        this.instance.use(logHTTP);

        // AWS health check
        this.instance.all("/health", (req: express.Request, res: express.Response): express.Response => res.send("OK"));

        // Ensure all requests include authorization JWT
        this.instance.use(requireJWTAuth);

        // Load from router modules
        this.instance.use(new Routes().router);

        // 404 Not Found
        // If no previous route handler has matched the request, this one is called
        this.instance.use((req: express.Request, res: express.Response): void => {
            if (!res.headersSent) {
                throw new NotFound();
            }
        });

        // Error handler
        // This catches any error thrown in the aplication
        // If the error is an HttpError, it is used in the response
        // For all other errors, the error is logged and an Internal Server Error is returned
        this.instance.use((err: HttpError | Error, req: express.Request, res: express.Response, next: express.NextFunction): void => {
            if (err instanceof HttpError) {
                logger.error(err);
                res.status(err.statusCode);
                res.jsonp({
                    error: {
                        message: err.message,
                    },
                });
            } else {
                const ise: HttpError = new InternalServerError();

                logger.error(err);

                res.status(ise.statusCode);
                res.jsonp({
                    message: ise.message,
                });

            }
        });

        return this.instance;

    }

    // Express application singleton instance
    private static instance: express.Application;

}
