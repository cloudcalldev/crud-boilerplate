import { IRecord } from ".";

export interface ICrudController {
  save(): Promise<IRecord>;
  delete(): Promise<void>;
  get(): Promise<IRecord[]>;
}
