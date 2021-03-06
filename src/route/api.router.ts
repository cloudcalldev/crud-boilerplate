import { Request, Response, Router } from "express";
import { BadRequest } from "http-errors";
import { getStatusText, OK } from "http-status-codes";
import { Crud } from "../controllers/crud.controller";
import { Configuration } from "../lib";
import { Logger } from "../lib/logger";
import { asyncMiddleware } from "../middleware/async.middleware";
import GraphiteController from "../lib/graphite";
import { GraphiteLabel } from "../enums";

export class ApiRouter {
  public router: Router = Router();
  private logger = Logger.getInstance();

  private BASE_PATH = "/";

  constructor() {
    this.router.get(`${this.BASE_PATH}/:id`, asyncMiddleware(async (req: Request, res: Response) => {
      const startTime = new Date();
      this.logger.debug({ id: req.params.id }, `Getting the record for ${req.params.id}`);

      const config = await Configuration.getCredentials();
      const graphite = GraphiteController.getInstance(config);
      graphite.write(GraphiteLabel.get);
      const crud = new Crud(config);

      try {
        const data = await crud.get(req.params.id);
        graphite.writeTiming(GraphiteLabel.get, startTime);
        return res.json({ status: getStatusText(OK), data });
      } catch (err) {
        graphite.write(GraphiteLabel.get, true);
        throw err;
      }
    }));

    this.router.post(`${this.BASE_PATH}/`, asyncMiddleware(async (req: Request, res: Response) => {
      const startTime = new Date();
      this.logger.debug({ record: req.body }, "Creating new record");

      // TODO: Validation

      const config = await Configuration.getCredentials();
      const graphite = GraphiteController.getInstance(config);
      graphite.write(GraphiteLabel.create);
      const crud = new Crud(config);

      try {
        const data = await crud.save(req.body);
        graphite.writeTiming(GraphiteLabel.create, startTime);
        return res.json({ status: getStatusText(OK), data });
      } catch (err) {
        graphite.write(GraphiteLabel.create, true);
        throw err;
      }
    }));

    // Although this is a post endpoint, it actually GETs data
    // This is a POST because you cannot pass a request body with a GET request and there is a character limit to GET request URL's
    this.router.post(`${this.BASE_PATH}/batch`, asyncMiddleware(async (req: Request, res: Response) => {
      const startTime = new Date();
      this.logger.debug({ ids: req.body.ids }, "Getting records for all Id's");

      if (!req.body.ids || req.body.ids.length <= 0) { throw new BadRequest("Required field `ids` is not present"); }

      const config = await Configuration.getCredentials();
      const graphite = GraphiteController.getInstance(config);
      graphite.write(GraphiteLabel.create);
      const crud = new Crud(config);

      try {
        const data = await crud.get(req.body.ids);
        graphite.writeTiming(GraphiteLabel.create, startTime);
        return res.json({ status: getStatusText(OK), data });
      } catch (err) {
        graphite.write(GraphiteLabel.create, true);
        throw err;
      }
    }));

    // The same as the route above, it will get many last read times for the channels in the query parameter
    this.router.get(`${this.BASE_PATH}/settings`, asyncMiddleware(async (req: Request, res: Response) => {
      const startTime = new Date();
      this.logger.debug({ ids: req.query.ids }, "Getting records as batch request");
      if (!req.query.ids || req.query.ids.length <= 0) { throw new BadRequest("Required field `ids` is not present"); }
      let ids: string | string[] = req.query.ids;

      // If they are passed as ?ids[]=1234&ids[]=4321 then we get an array directly
      // However if they are passed as ?ids=1234,4321 then we get a string
      if (!Array.isArray(ids)) {
        ids = (ids as string).split(",").map((s: string) => s.trim());
      }

      const config = await Configuration.getCredentials();
      const crud = new Crud(config);
      const graphite = GraphiteController.getInstance(config);
      graphite.write(GraphiteLabel.create);

      try {
        const data = await crud.get(req.query.ids);
        graphite.writeTiming(GraphiteLabel.get, startTime);
        return res.json({ status: getStatusText(OK), data });
      } catch (err) {
        graphite.write(GraphiteLabel.get, true);
        throw err;
      }
    }));

    this.router.put(`${this.BASE_PATH}/:id`, asyncMiddleware(async (req: Request, res: Response) => {
      const startTime = new Date();
      this.logger.debug({ id: req.params.id }, `Updating the record with ID ${req.params.id}`);

      const config = await Configuration.getCredentials();
      const graphite = GraphiteController.getInstance(config);
      graphite.write(GraphiteLabel.update);

      const settingsInstance = new Crud(config);

      try {
        const data = await settingsInstance.save(req.body);
        graphite.writeTiming(GraphiteLabel.update, startTime);
        return res.json({ status: getStatusText(OK), data });
      } catch (err) {
        graphite.write(GraphiteLabel.update, true);
        throw err;
      }
    }));

    this.router.delete(`${this.BASE_PATH}/:id`, asyncMiddleware(async (req: Request, res: Response) => {
      const startTime = new Date();
      this.logger.debug({ id: req.params.id }, `Deleting a record by Id ${req.params.id}`);

      const config = await Configuration.getCredentials();
      const graphite = GraphiteController.getInstance(config);
      graphite.write(GraphiteLabel.delete);

      const crud = new Crud(config);

      try {
        await crud.delete(req.params.id);
        graphite.writeTiming(GraphiteLabel.delete, startTime);
        return res.json({ status: getStatusText(OK) });
      } catch (err) {
        graphite.write(GraphiteLabel.delete, true);
        throw err;
      }
    }));
  }
}
