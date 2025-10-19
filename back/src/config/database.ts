import { MongoClient, Db } from 'mongodb';

export class DatabaseConfig {
  private static client: MongoClient | null = null;
  private static db: Db | null = null;

  static async connect(): Promise<Db> {
    if (this.db) {
      return this.db;
    }

    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/halloween-quiz';
    const dbName = process.env.MONGODB_DB_NAME || 'halloween-quiz';

    try {
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db(dbName);
      console.log('✅ MongoDB connected successfully');
      return this.db;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('✅ MongoDB disconnected');
    }
  }

  static getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }
}
