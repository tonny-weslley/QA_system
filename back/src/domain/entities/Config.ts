export interface Config {
  id: string;
  key: string;
  value: boolean | string | number;
  updatedAt: Date;
}

export class ConfigEntity implements Config {
  constructor(
    public id: string,
    public key: string,
    public value: boolean | string | number,
    public updatedAt: Date
  ) {}
}
