export interface IDatabase {
  get(): Promise<any>;
  save(): Promise<any>;
  delete(): Promise<any>;
}