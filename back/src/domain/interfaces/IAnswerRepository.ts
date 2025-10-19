import { Answer, CreateAnswerDTO } from '../entities/Answer';

export interface IAnswerRepository {
  create(data: CreateAnswerDTO & { isCorrect: boolean; pointsEarned: number }): Promise<Answer>;
  findById(id: string): Promise<Answer | null>;
  findByUserId(userId: string): Promise<Answer[]>;
  findByQuestionId(questionId: string): Promise<Answer[]>;
  findByUserAndQuestion(userId: string, questionId: string): Promise<Answer | null>;
  findAll(): Promise<Answer[]>;
}
