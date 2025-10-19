import { Collection, Db, ObjectId } from 'mongodb';
import { Config, ConfigEntity } from '../../../domain/entities/Config';
import { IConfigRepository } from '../../../domain/interfaces/IConfigRepository';

export class ConfigRepository implements IConfigRepository {
  private collection: Collection;

  constructor(db: Db) {
    this.collection = db.collection('configs');
  }

  async findByKey(key: string): Promise<Config | null> {
    const doc = await this.collection.findOne({ key });
    if (!doc) return null;

    return new ConfigEntity(
      doc._id.toString(),
      doc.key,
      doc.value,
      doc.updatedAt
    );
  }

  async upsert(key: string, value: boolean | string | number): Promise<Config> {
    const result = await this.collection.findOneAndUpdate(
      { key },
      {
        $set: {
          value,
          updatedAt: new Date(),
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      }
    );

    return new ConfigEntity(
      result._id.toString(),
      result.key,
      result.value,
      result.updatedAt
    );
  }

  async getAll(): Promise<Config[]> {
    const docs = await this.collection.find().toArray();
    return docs.map(
      (doc) =>
        new ConfigEntity(doc._id.toString(), doc.key, doc.value, doc.updatedAt)
    );
  }
}
