// This is the base router, which provides a few generic utility endpoints
import { Request, Response, Router } from "express";
import { ImATeapot } from "http-errors";
import { join } from "path";
import { IPackage } from "../interfaces";

export class HomeRouter {
    public router: Router = Router();

    constructor() {

        /**
         * Responds with project metadata
         * This endpoint is useful to interrogate the status and version of the running service
         */
        this.router.all("/", (req: Request, res: Response): void => {

            const metadata: IPackage = require(join("..", "..", "package.json"));

            res.jsonp({
                data: {
                    author: metadata.author,
                    description: metadata.description,
                    name: metadata.name,
                    version: metadata.version,
                },
            });

        });

        /**
         * Responds with HTTP I'm A Teapot Error
         */
        this.router.all("/teapot", (req: Request, res: Response): void => {
            throw new ImATeapot();
        });

        /**
         * Thrown native Error
         * Should log native Error and return Server Error
         */
        this.router.all("/error", (req: Request, res: Response): void => {
            throw new Error("Danger Will Robinson");
        });
    }
}
