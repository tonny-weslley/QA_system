import bcrypt from 'bcrypt';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserResponse } from '../../domain/entities/User';
import { JWTService } from '../../infra/auth/JWTService';

export interface LoginUserDTO {
  username: string;
  password: string;
}

export interface LoginUserResponse {
  user: UserResponse;
  token: string;
}

export class LoginUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: LoginUserDTO): Promise<LoginUserResponse> {
    // Validações
    if (!data.username || !data.password) {
      throw new Error('Username and password are required');
    }

    // Buscar usuário
    const user = await this.userRepository.findByUsername(data.username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Gerar token JWT
    const token = JWTService.generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    // Retornar sem a senha
    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }
}
