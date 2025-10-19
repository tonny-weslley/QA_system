import { Collection, ObjectId } from 'mongodb';
import { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import { Question, CreateQuestionDTO, UpdateQuestionDTO } from '../../../domain/entities/Question';
import { DatabaseConfig } from '../../../config/database';
import { v4 as uuidv4 } from 'uuid';

export class QuestionRepository implements IQuestionRepository {
  private collection: Collection;

  constructor() {
    const db = DatabaseConfig.getDb();
    this.collection = db.collection('questions');
  }

  async create(data: CreateQuestionDTO): Promise<Question> {
    const now = new Date();
    const question = {
      statement: data.statement,
      options: data.options.map((opt) => ({
        id: uuidv4(),
        text: opt.text,
        isCorrect: opt.isCorrect,
      })),
      difficulty: data.difficulty,
      qrCodeUrl: '', // Will be generated after insertion
      isLocked: false,
      createdBy: data.createdBy,
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.collection.insertOne(question);
    const questionId = result.insertedId.toString();

    return {
      id: questionId,
      ...question,
      qrCodeUrl: `/question/${questionId}`,
    } as Question;
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!question) return null;

    return {
      id: question._id.toString(),
      statement: question.statement,
      options: question.options,
      difficulty: question.difficulty,
      qrCodeUrl: question.qrCodeUrl || `/question/${question._id.toString()}`,
      isLocked: question.isLocked,
      createdBy: question.createdBy,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  async findAll(): Promise<Question[]> {
    const questions = await this.collection.find({}).toArray();
    return questions.map((q) => ({
      id: q._id.toString(),
      statement: q.statement,
      options: q.options,
      difficulty: q.difficulty,
      qrCodeUrl: q.qrCodeUrl || `/question/${q._id.toString()}`,
      isLocked: q.isLocked,
      createdBy: q.createdBy,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
    }));
  }

  async findAvailable(): Promise<Question[]> {
    const questions = await this.collection.find({ isLocked: false }).toArray();
    return questions.map((q) => ({
      id: q._id.toString(),
      statement: q.statement,
      options: q.options,
      difficulty: q.difficulty,
      qrCodeUrl: q.qrCodeUrl || `/question/${q._id.toString()}`,
      isLocked: q.isLocked,
      createdBy: q.createdBy,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
    }));
  }

  async update(id: string, data: UpdateQuestionDTO): Promise<Question | null> {
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (data.statement) updateData.statement = data.statement;
    if (data.difficulty) updateData.difficulty = data.difficulty;
    if (data.options) {
      updateData.options = data.options.map((opt) => ({
        id: uuidv4(),
        text: opt.text,
        isCorrect: opt.isCorrect,
      }));
    }

    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) return null;

    return {
      id: result._id.toString(),
      statement: result.statement,
      options: result.options,
      difficulty: result.difficulty,
      qrCodeUrl: result.qrCodeUrl || `/question/${result._id.toString()}`,
      isLocked: result.isLocked,
      createdBy: result.createdBy,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async lockQuestion(id: string): Promise<boolean> {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isLocked: true, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  async unlockAll(): Promise<boolean> {
    const result = await this.collection.updateMany(
      {},
      { $set: { isLocked: false, updatedAt: new Date() } }
    );
    return result.modifiedCount >= 0;
  }
}
