import * as bunyan from "bunyan";

import { NextFunction, Request, Response } from "express";
import { set as setForRequest } from "express-http-context";
import { v4 } from "uuid";
import { Logger } from "../lib/logger";

const correlationIdHeader = "cloudcall-request-id";
const logger: bunyan = Logger.getInstance();

/**
 * Logger middleware
 * Logs the request method, path and response code
 *
 * @param req Express Request
 * @param res Express Response
 * @param next Express Next Function
 */
export function logHTTP(req: Request, res: Response, next: NextFunction) {

    // This header is passed in from Kong thanks to the following plugin
    // https://docs.konghq.com/plugins/correlation-id/
    setForRequest("correlationId", req.header(correlationIdHeader) || v4());

    function requestLogger() {

        res.removeListener("finish", requestLogger);
        res.removeListener("close", requestLogger);

        logger.info({ req, res }, `${res.statusCode} ${req.method} ${req.url}`);

    }

    res.on("finish", requestLogger);
    res.on("close", requestLogger);

    next();

}
