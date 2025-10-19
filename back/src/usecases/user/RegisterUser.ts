import bcrypt from 'bcrypt';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { CreateUserDTO, UserResponse } from '../../domain/entities/User';
import { JWTService } from '../../infra/auth/JWTService';

export interface RegisterUserResponse {
  user: UserResponse;
  token: string;
}

export class RegisterUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<RegisterUserResponse> {
    // Validações
    if (!data.username || data.username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }

    if (!data.password || data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Verificar se username já existe
    const existingUser = await this.userRepository.findByUsername(data.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Criar usuário
    const user = await this.userRepository.create({
      username: data.username,
      password: hashedPassword,
      role: data.role || 'participant',
    });

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
