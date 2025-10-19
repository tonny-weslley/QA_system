import { apiClient } from './client';

export interface DashboardStats {
  totalQuestions: number;
  lockedQuestions: number;
  availableQuestions: number;
  totalAnswers: number;
  totalParticipants: number;
  totalAdmins: number;
  topScores: Array<{
    username: string;
    totalPoints: number;
    rank: number;
  }>;
  questionStats: Array<{
    questionId: string;
    statement: string;
    difficulty: string;
    totalAnswers: number;
    correctAnswers: number;
    isLocked: boolean;
  }>;
}

export const adminApi = {
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },

  resetQuestions: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/admin/reset-questions');
    return response.data;
  },

  resetScores: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/admin/reset-scores');
    return response.data;
  },

  finalizeEvent: async (): Promise<any> => {
    const response = await apiClient.post('/admin/finalize-event');
    return response.data;
  },
};
