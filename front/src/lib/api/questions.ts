import { apiClient } from './client';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: string;
  code: string;
  statement: string;
  options: QuestionOption[];
  difficulty: 'easy' | 'medium' | 'hard';
  qrCodeUrl: string;
  isLocked: boolean;
  visible: boolean;
  createdAt: string;
}

export interface CreateQuestionData {
  statement: string;
  options: Array<{ text: string; isCorrect: boolean }>;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const questionsApi = {
  getAll: async (): Promise<Question[]> => {
    const response = await apiClient.get('/questions');
    return response.data;
  },

  getById: async (id: string): Promise<Question> => {
    const response = await apiClient.get(`/questions/${id}`);
    return response.data;
  },

  getByCode: async (code: string): Promise<Question> => {
    const response = await apiClient.get(`/questions/code/${code}`);
    return response.data;
  },

  create: async (data: CreateQuestionData): Promise<Question> => {
    const response = await apiClient.post('/questions', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateQuestionData>): Promise<Question> => {
    const response = await apiClient.put(`/questions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/questions/${id}`);
  },

  updateVisibility: async (id: string, visible: boolean): Promise<void> => {
    await apiClient.patch(`/questions/${id}/visibility`, { visible });
  },
};
