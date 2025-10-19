import { RegisterUser } from './RegisterUser';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User, CreateUserDTO } from '../../domain/entities/User';
import bcrypt from 'bcrypt';

// Mock do bcrypt
jest.mock('bcrypt');

describe('RegisterUser UseCase', () => {
  let registerUser: RegisterUser;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    // Criar mock do repositório
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUsername: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    registerUser = new RegisterUser(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful Registration', () => {
    it('should register a new user with valid data', async () => {
      // Arrange
      const userData: CreateUserDTO = {
        username: 'testuser',
        password: 'password123',
        role: 'participant',
      };

      const hashedPassword = 'hashed_password';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      mockUserRepository.findByUsername.mockResolvedValue(null);

      const createdUser: User = {
        id: '123',
        username: userData.username,
        password: hashedPassword,
        role: 'participant',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.create.mockResolvedValue(createdUser);

      // Act
      const result = await registerUser.execute(userData);

      // Assert
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(userData.username);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        username: userData.username,
        password: hashedPassword,
        role: 'participant',
      });
      expect(result.user).toEqual({
        id: createdUser.id,
        username: createdUser.username,
        role: createdUser.role,
        createdAt: createdUser.createdAt,
      });
      expect(result.token).toBeDefined();
    });

    it('should default to participant role if not specified', async () => {
      // Arrange
      const userData: CreateUserDTO = {
        username: 'testuser',
        password: 'password123',
      };

      const hashedPassword = 'hashed_password';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      mockUserRepository.findByUsername.mockResolvedValue(null);

      const createdUser: User = {
        id: '123',
        username: userData.username,
        password: hashedPassword,
        role: 'participant',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.create.mockResolvedValue(createdUser);

      // Act
      const result = await registerUser.execute(userData);

      // Assert
      expect(result.user.role).toBe('participant');
    });
  });

  describe('Validation Errors', () => {
    it('should throw error if username is less than 3 characters', async () => {
      // Arrange
      const userData: CreateUserDTO = {
        username: 'ab',
        password: 'password123',
      };

      // Act & Assert
      await expect(registerUser.execute(userData)).rejects.toThrow(
        'Username must be at least 3 characters long'
      );
    });

    it('should throw error if password is less than 6 characters', async () => {
      // Arrange
      const userData: CreateUserDTO = {
        username: 'testuser',
        password: '12345',
      };

      // Act & Assert
      await expect(registerUser.execute(userData)).rejects.toThrow(
        'Password must be at least 6 characters long'
      );
    });

    it('should throw error if username already exists', async () => {
      // Arrange
      const userData: CreateUserDTO = {
        username: 'existinguser',
        password: 'password123',
      };

      const existingUser: User = {
        id: '123',
        username: 'existinguser',
        password: 'hashed',
        role: 'participant',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByUsername.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(registerUser.execute(userData)).rejects.toThrow('Username already exists');
    });
  });
});
