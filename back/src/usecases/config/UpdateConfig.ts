import { IConfigRepository } from '../../domain/interfaces/IConfigRepository';
import { Config } from '../../domain/entities/Config';

export class UpdateConfig {
  constructor(private configRepository: IConfigRepository) {}

  async execute(
    key: string,
    value: boolean | string | number
  ): Promise<Config> {
    return await this.configRepository.upsert(key, value);
  }
}
