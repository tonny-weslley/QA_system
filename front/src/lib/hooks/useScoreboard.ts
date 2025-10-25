import { useState, useEffect } from 'react';
import { scoresApi } from '../api/scores';
import type { ScoreboardResponse, UserScore } from '../api/scores';

export const useScoreboard = () => {
  const [scoreboard, setScoreboard] = useState<ScoreboardResponse | null>(null);
  const [myScore, setMyScore] = useState<UserScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadScoreboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await scoresApi.getScoreboard();
      setScoreboard(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar scoreboard');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMyScore = async () => {
    try {
      const data = await scoresApi.getMyScore();
      setMyScore(data);
    } catch (err: any) {
      console.error('Erro ao carregar meu score:', err);
    }
  };

  useEffect(() => {
    loadScoreboard();
    loadMyScore();
  }, []);

  return {
    scoreboard,
    myScore,
    isLoading,
    error,
    loadScoreboard,
    loadMyScore,
  };
};
