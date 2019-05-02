import { IApplicationConfiguration, ICrudController, IRecord } from "../interfaces";

export class Crud implements ICrudController {
  private config: IApplicationConfiguration;
  constructor(config: IApplicationConfiguration) {
    this.config = config;
  }

  public async get(id: string | string[]): Promise<IRecord[]> {
    return [];
  }
  public async save(record: IRecord): Promise<IRecord> {
    return record;
  }
  public async delete(id: string): Promise<void> {
    return;
  }
}
