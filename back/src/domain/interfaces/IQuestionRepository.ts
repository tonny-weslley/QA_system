import { Question, CreateQuestionDTO, UpdateQuestionDTO } from '../entities/Question';

export interface IQuestionRepository {
  create(data: CreateQuestionDTO): Promise<Question>;
  findById(id: string): Promise<Question | null>;
  findAll(): Promise<Question[]>;
  findAvailable(): Promise<Question[]>;
  update(id: string, data: UpdateQuestionDTO): Promise<Question | null>;
  delete(id: string): Promise<boolean>;
  lockQuestion(id: string): Promise<boolean>;
  unlockAll(): Promise<boolean>;
}
