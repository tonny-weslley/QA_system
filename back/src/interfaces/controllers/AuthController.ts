import { Request, Response } from 'express';
import { RegisterUser } from '../../usecases/user/RegisterUser';
import { LoginUser } from '../../usecases/user/LoginUser';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';

export class AuthController {
  private registerUser: RegisterUser;
  private loginUser: LoginUser;

  constructor(userRepository: IUserRepository) {
    this.registerUser = new RegisterUser(userRepository);
    this.loginUser = new LoginUser(userRepository);
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, role } = req.body;

      const result = await this.registerUser.execute({
        username,
        password,
        role,
      });

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      const result = await this.loginUser.execute({
        username,
        password,
      });

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
