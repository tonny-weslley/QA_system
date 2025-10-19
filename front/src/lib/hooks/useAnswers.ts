import { useState } from 'react';
import { answersApi } from '../api/answers';
import type { SubmitAnswerData, AnswerResponse } from '../api/answers';

export const useAnswers = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAnswer = async (data: SubmitAnswerData): Promise<AnswerResponse> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await answersApi.submit(data);
      return response;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Erro ao enviar resposta';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMyAnswers = async () => {
    try {
      return await answersApi.getMyAnswers();
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erro ao carregar respostas');
    }
  };

  return {
    submitAnswer,
    getMyAnswers,
    isSubmitting,
    error,
  };
};
