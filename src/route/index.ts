// This is the parent-router for exposing other router modules
import { Router } from "express";
import { ApiRouter } from "./api.router";
import { HomeRouter } from "./home.router";
import { HealthRouter } from "./health.router";

export class Routes {
    public router: Router = Router();

    constructor() {
        this.router.use(new HomeRouter().router);
        this.router.use(new ApiRouter().router);
        this.router.use(new HealthRouter().router);
    }
}
