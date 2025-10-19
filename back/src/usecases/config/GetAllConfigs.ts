import { IConfigRepository } from '../../domain/interfaces/IConfigRepository';
import { Config } from '../../domain/entities/Config';

export class GetAllConfigs {
  constructor(private configRepository: IConfigRepository) {}

  async execute(): Promise<Record<string, boolean | string | number>> {
    const configs = await this.configRepository.getAll();
    
    const result: Record<string, boolean | string | number> = {
      'questions.visible': true, // valor padrão
    };

    configs.forEach((config) => {
      result[config.key] = config.value;
    });

    return result;
  }
}
