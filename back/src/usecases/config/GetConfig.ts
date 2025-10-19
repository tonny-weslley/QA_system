import { IConfigRepository } from '../../domain/interfaces/IConfigRepository';

export class GetConfig {
  constructor(private configRepository: IConfigRepository) {}

  async execute(key: string): Promise<boolean | string | number> {
    const config = await this.configRepository.findByKey(key);
    
    // Valores padrão
    const defaults: Record<string, boolean | string | number> = {
      'questions.visible': true,
    };

    if (!config) {
      return defaults[key] ?? true;
    }

    return config.value;
  }
}
