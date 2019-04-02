import { ICrudController } from "../interfaces";

class Crud implements ICrudController {
  constructor() { }

  get(id: string | string[]): Promise<IRecord[]> { }
  save(record: IRecord): Promise<IRecord> { }
  delete(): Promise<void> {
  }
}

export default Crud;
