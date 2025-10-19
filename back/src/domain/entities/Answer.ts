export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  pointsEarned: number;
  answeredAt: Date;
}

export interface CreateAnswerDTO {
  questionId: string;
  userId: string;
  selectedOptionId: string;
}

export interface AnswerResponse {
  id: string;
  questionId: string;
  isCorrect: boolean;
  pointsEarned: number;
  correctOptionId?: string;
  answeredAt: Date;
}
