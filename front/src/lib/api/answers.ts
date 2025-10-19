import { apiClient } from './client';

export interface SubmitAnswerData {
  questionId: string;
  selectedOptionId: string;
}

export interface AnswerResponse {
  id: string;
  questionId: string;
  isCorrect: boolean;
  pointsEarned: number;
  correctOptionId?: string;
  answeredAt: string;
}

export const answersApi = {
  submit: async (data: SubmitAnswerData): Promise<AnswerResponse> => {
    const response = await apiClient.post('/answers', data);
    return response.data;
  },

  getMyAnswers: async (): Promise<AnswerResponse[]> => {
    const response = await apiClient.get('/answers/me');
    return response.data;
  },
};
