export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  statement: string;
  options: QuestionOption[];
  difficulty: 'easy' | 'medium' | 'hard';
  qrCodeUrl: string;
  isLocked: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface CreateQuestionDTO {
  statement: string;
  options: Array<{ text: string; isCorrect: boolean }>;
  difficulty: QuestionDifficulty;
  createdBy: string;
}

export interface UpdateQuestionDTO {
  statement?: string;
  options?: Array<{ text: string; isCorrect: boolean }>;
  difficulty?: QuestionDifficulty;
}

export interface QuestionResponse {
  id: string;
  statement: string;
  options: Array<{ id: string; text: string; isCorrect?: boolean }>;
  difficulty: QuestionDifficulty;
  qrCodeUrl: string;
  isLocked: boolean;
  createdAt: Date;
}
