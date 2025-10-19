import { apiClient } from './client';

export interface ScoreboardEntry {
  rank: number;
  username: string;
  totalPoints: number;
}

export interface AdminScoreboardEntry extends ScoreboardEntry {
  easyPoints: number;
  mediumPoints: number;
  hardPoints: number;
}

export interface ScoreboardResponse {
  participants: ScoreboardEntry[];
  adminView?: AdminScoreboardEntry[];
}

export interface UserScore {
  userId: string;
  username: string;
  easyPoints: number;
  mediumPoints: number;
  hardPoints: number;
  totalPoints: number;
  updatedAt: string;
}

export const scoresApi = {
  getScoreboard: async (): Promise<ScoreboardResponse> => {
    const response = await apiClient.get('/scores');
    return response.data;
  },

  getMyScore: async (): Promise<UserScore> => {
    const response = await apiClient.get('/scores/me');
    return response.data;
  },
};
