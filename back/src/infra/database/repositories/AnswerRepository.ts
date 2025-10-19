import { Collection, ObjectId } from 'mongodb';
import { IAnswerRepository } from '../../../domain/interfaces/IAnswerRepository';
import { Answer, CreateAnswerDTO } from '../../../domain/entities/Answer';
import { DatabaseConfig } from '../../../config/database';

export class AnswerRepository implements IAnswerRepository {
  private collection: Collection;

  constructor() {
    const db = DatabaseConfig.getDb();
    this.collection = db.collection('answers');
  }

  async create(
    data: CreateAnswerDTO & { isCorrect: boolean; pointsEarned: number }
  ): Promise<Answer> {
    const now = new Date();
    const answer = {
      questionId: data.questionId,
      userId: data.userId,
      selectedOptionId: data.selectedOptionId,
      isCorrect: data.isCorrect,
      pointsEarned: data.pointsEarned,
      answeredAt: now,
    };

    const result = await this.collection.insertOne(answer);

    return {
      id: result.insertedId.toString(),
      ...answer,
    };
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!answer) return null;

    return {
      id: answer._id.toString(),
      questionId: answer.questionId,
      userId: answer.userId,
      selectedOptionId: answer.selectedOptionId,
      isCorrect: answer.isCorrect,
      pointsEarned: answer.pointsEarned,
      answeredAt: answer.answeredAt,
    };
  }

  async findByUserId(userId: string): Promise<Answer[]> {
    const answers = await this.collection.find({ userId }).toArray();
    return answers.map((a) => ({
      id: a._id.toString(),
      questionId: a.questionId,
      userId: a.userId,
      selectedOptionId: a.selectedOptionId,
      isCorrect: a.isCorrect,
      pointsEarned: a.pointsEarned,
      answeredAt: a.answeredAt,
    }));
  }

  async findByQuestionId(questionId: string): Promise<Answer[]> {
    const answers = await this.collection.find({ questionId }).toArray();
    return answers.map((a) => ({
      id: a._id.toString(),
      questionId: a.questionId,
      userId: a.userId,
      selectedOptionId: a.selectedOptionId,
      isCorrect: a.isCorrect,
      pointsEarned: a.pointsEarned,
      answeredAt: a.answeredAt,
    }));
  }

  async findByUserAndQuestion(userId: string, questionId: string): Promise<Answer | null> {
    const answer = await this.collection.findOne({ userId, questionId });
    if (!answer) return null;

    return {
      id: answer._id.toString(),
      questionId: answer.questionId,
      userId: answer.userId,
      selectedOptionId: answer.selectedOptionId,
      isCorrect: answer.isCorrect,
      pointsEarned: answer.pointsEarned,
      answeredAt: answer.answeredAt,
    };
  }

  async findAll(): Promise<Answer[]> {
    const answers = await this.collection.find({}).toArray();
    return answers.map((a) => ({
      id: a._id.toString(),
      questionId: a.questionId,
      userId: a.userId,
      selectedOptionId: a.selectedOptionId,
      isCorrect: a.isCorrect,
      pointsEarned: a.pointsEarned,
      answeredAt: a.answeredAt,
    }));
  }
}
