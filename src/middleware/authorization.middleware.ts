import { NextFunction, Request, Response } from "express";
import { BadRequest } from "http-errors";
import * as jwt from "jsonwebtoken";

/**
 * Ensure the request provides a JWT token
 * If so, unpack the token payload an attach it to the request object
 *
 * @param req Express Request
 * @param res Express Response
 * @param next Express Next Function
 */
export function requireJWTAuth(req: Request, res: Response, next: NextFunction): void {

    const authHeader: string | undefined = req.header("authorization");

    if (authHeader !== undefined && authHeader.match(/^bearer /i)) {
        // Unpack JWT provided in authorization header
        req.jwt = jwt.decode(authHeader.replace(/^bearer /i, "")) as IJwtData;
        req.jwtToken = authHeader.replace(/^bearer /i, "");
    } else if (req.query.jwt) {
        // Unpack JWT provided in query string
        req.jwt = jwt.decode(req.query.jwt) as IJwtData;
        req.jwtToken = req.query.jwt;
    } else {
        throw new BadRequest("Required JWT authorization token missing");
    }

    if (!req.jwt) {
        throw new BadRequest("Malformed JWT authorization token provided");
    }

    next();

}
