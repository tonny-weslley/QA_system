import { Config } from '../entities/Config';

export interface IConfigRepository {
  findByKey(key: string): Promise<Config | null>;
  upsert(key: string, value: boolean | string | number): Promise<Config>;
  getAll(): Promise<Config[]>;
}
