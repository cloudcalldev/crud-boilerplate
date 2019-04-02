import { IRecord } from ".";

export interface ICrudController {
  save(record: IRecord): Promise<IRecord>;
  delete(id: string): Promise<void>;
  get(id: string | string[]): Promise<IRecord[]>;
}
