import { Request, Response, Router } from "express";
import { BadRequest } from "http-errors";
import { getStatusText, OK } from "http-status-codes";
import { Crud } from "../controllers";
import { Configuration } from "../lib";
import { Logger } from "../lib/logger";
import { asyncMiddleware } from "../middleware/async.middleware";

export class ApiRouter {
  public router: Router = Router();
  private logger = Logger.getInstance();

  private BASE_PATH = "/";

  constructor() {
    this.router.get(`${this.BASE_PATH}/:id`, asyncMiddleware(async (req: Request, res: Response) => {
      this.logger.debug({ id: req.params.id }, `Getting the record for ${req.params.id}`);

      const config = await Configuration.getCredentials();
      const crud = new Crud(config);

      const data = await crud.get(req.params.id);

      return res.json({ status: getStatusText(OK), data });
    }));

    this.router.post(`${this.BASE_PATH}/`, asyncMiddleware(async (req: Request, res: Response) => {
      this.logger.debug({ record: req.body }, "Creating new record");

      // TODO: Validation

      const config = await Configuration.getCredentials();
      const crud = new Crud(config);
      const record = await crud.save(req.body);

      return res.json({ status: getStatusText(OK) });
    }));

    // Although this is a post endpoint, it actually GETs data
    // This is a POST because you cannot pass a request body with a GET request and there is a character limit to GET request URL's
    this.router.post(`${this.BASE_PATH}/batch`, asyncMiddleware(async (req: Request, res: Response) => {
      this.logger.debug({ ids: req.body.ids }, "Getting records for all Id's");

      if (!req.body.ids || req.body.ids.length <= 0) { throw new BadRequest("Required field `ids` is not present"); }

      const config = await Configuration.getCredentials();
      const crud = new Crud(config);
      const data = await crud.get(req.body.ids);
      return res.json({ status: getStatusText(OK), data });
    }));

    // The same as the route above, it will get many last read times for the channels in the query parameter
    this.router.get(`${this.BASE_PATH}/settings`, asyncMiddleware(async (req: Request, res: Response) => {
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
      const data = await crud.get(req.query.ids);
      return res.json({ status: getStatusText(OK), data });
    }));

    this.router.put(`${this.BASE_PATH}/:id`, asyncMiddleware(async (req: Request, res: Response) => {
      this.logger.debug({ id: req.params.id }, `Updating the record with ID ${req.params.id}`);

      const config = await Configuration.getCredentials();
      const settingsInstance = new Crud(config);
      const record = await settingsInstance.save(req.body);

      return res.json({ status: getStatusText(OK) });
    }));

    this.router.delete(`${this.BASE_PATH}/:id`, asyncMiddleware(async (req: Request, res: Response) => {
      this.logger.debug({ id: req.params.id }, `Deleting a record by Id ${req.params.id}`);

      const config = await Configuration.getCredentials();
      const crud = new Crud(config);
      await crud.delete(req.params.id);

      return res.json({ status: getStatusText(OK) });
    }));
  }
}
