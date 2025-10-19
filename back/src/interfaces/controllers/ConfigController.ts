import { Request, Response } from 'express';
import { GetConfig } from '../../usecases/config/GetConfig';
import { UpdateConfig } from '../../usecases/config/UpdateConfig';
import { GetAllConfigs } from '../../usecases/config/GetAllConfigs';
import { IConfigRepository } from '../../domain/interfaces/IConfigRepository';

export class ConfigController {
  private getConfig: GetConfig;
  private updateConfig: UpdateConfig;
  private getAllConfigs: GetAllConfigs;

  constructor(configRepository: IConfigRepository) {
    this.getConfig = new GetConfig(configRepository);
    this.updateConfig = new UpdateConfig(configRepository);
    this.getAllConfigs = new GetAllConfigs(configRepository);
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const { key } = req.params;
      const value = await this.getConfig.execute(key);
      res.status(200).json({ key, value });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { key } = req.params;
      const { value } = req.body;

      const config = await this.updateConfig.execute(key, value);
      res.status(200).json(config);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const configs = await this.getAllConfigs.execute();
      res.status(200).json(configs);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
