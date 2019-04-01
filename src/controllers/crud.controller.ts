import { ICrudController } from "../interfaces";

class Crud implements ICrudController {
  constructor() { }

  get(): Promise<IRecord[]> { }
  save(): Promise<IRecord> { }
  delete(): Promise<void> {
  }
}

export default Crud;
