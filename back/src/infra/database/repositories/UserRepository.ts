import { Collection, ObjectId } from 'mongodb';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { User, CreateUserDTO } from '../../../domain/entities/User';
import { DatabaseConfig } from '../../../config/database';

export class UserRepository implements IUserRepository {
  private collection: Collection;

  constructor() {
    const db = DatabaseConfig.getDb();
    this.collection = db.collection('users');
  }

  async create(data: CreateUserDTO): Promise<User> {
    const now = new Date();
    const user = {
      username: data.username,
      password: data.password,
      role: data.role || 'participant',
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.collection.insertOne(user);
    return {
      id: result.insertedId.toString(),
      ...user,
    } as User;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!user) return null;

    return {
      id: user._id.toString(),
      username: user.username,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.collection.findOne({ username });
    if (!user) return null;

    return {
      id: user._id.toString(),
      username: user.username,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findAll(): Promise<User[]> {
    const users = await this.collection.find({}).toArray();
    return users.map((user) => ({
      id: user._id.toString(),
      username: user.username,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) return null;

    return {
      id: result._id.toString(),
      username: result.username,
      password: result.password,
      role: result.role,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}
