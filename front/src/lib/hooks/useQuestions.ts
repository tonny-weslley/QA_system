import { useState, useEffect } from 'react';
import { questionsApi } from '../api/questions';
import type { Question } from '../api/questions';

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await questionsApi.getAll();
      setQuestions(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar perguntas');
    } finally {
      setIsLoading(false);
    }
  };

  const getQuestion = async (id: string) => {
    try {
      return await questionsApi.getById(id);
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erro ao carregar pergunta');
    }
  };

  const createQuestion = async (data: any) => {
    try {
      const newQuestion = await questionsApi.create(data);
      setQuestions([...questions, newQuestion]);
      return newQuestion;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erro ao criar pergunta');
    }
  };

  const updateQuestion = async (id: string, data: any) => {
    try {
      const updated = await questionsApi.update(id, data);
      setQuestions(questions.map((q) => (q.id === id ? updated : q)));
      return updated;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erro ao atualizar pergunta');
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      await questionsApi.delete(id);
      setQuestions(questions.filter((q) => q.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erro ao deletar pergunta');
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  return {
    questions,
    isLoading,
    error,
    loadQuestions,
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
  };
};
