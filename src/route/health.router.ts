// This is the base router, which provides a few generic utility endpoints
import { Request, Response, Router } from "express";

export class HealthRouter {
  public router: Router = Router();

  constructor() {

    /**
     * Responds with project metadata
     * This endpoint is useful to interrogate the status and version of the running service
     */
    this.router.all("/health", (req: Request, res: Response): void => {
      // TODO: Do DB health check
    });
  }
}
