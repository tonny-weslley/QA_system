import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionsApi } from '../../../lib/api/questions';
import type { Question } from '../../../lib/api/questions';
import { useAuth } from '../../../lib/context/AuthContext';
import { AdminLayout } from '../../templates/AdminLayout';
import { QuestionCard } from '../../organisms/QuestionCard';
import { QuestionForm } from '../../organisms/QuestionForm';
import type { QuestionFormData } from '../../organisms/QuestionForm';
import { Button } from '../../atoms/Button';
import { Card, CardContent } from '../../molecules/Card';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminQuestionsPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await questionsApi.getAll();
      setQuestions(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar perguntas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: QuestionFormData) => {
    try {
      await questionsApi.create({
        statement: data.statement,
        options: data.options,
        difficulty: data.difficulty,
      });
      
      setShowForm(false);
      loadQuestions();
      alert('Pergunta criada com sucesso!');
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erro ao criar pergunta');
    }
  };

  const handleEdit = async (data: QuestionFormData) => {
    if (!editingQuestion) return;

    try {
      await questionsApi.update(editingQuestion.id, {
        statement: data.statement,
        options: data.options,
        difficulty: data.difficulty,
      });
      
      setEditingQuestion(null);
      setShowForm(false);
      loadQuestions();
      alert('Pergunta atualizada com sucesso!');
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erro ao atualizar pergunta');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta pergunta? Esta ação não pode ser desfeita!')) {
      return;
    }

    try {
      await questionsApi.delete(id);
      loadQuestions();
      alert('Pergunta deletada com sucesso!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao deletar pergunta');
    }
  };

  const handleEditClick = (question: Question) => {
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingQuestion(null);
  };

  if (!user || user.role !== 'admin') {
    navigate('/questions');
    return null;
  }

  if (isLoading) {
    return (
      <AdminLayout
        username={user.username}
        onScoreboardClick={() => navigate('/scoreboard')}
        onLogout={logout}
      >
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-halloween-purple mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando perguntas...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      username={user.username}
      onScoreboardClick={() => navigate('/scoreboard')}
      onLogout={logout}
    >
      <div className="space-y-6">
        {/* Header com botão de criar */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Gerenciar Perguntas</h2>
            <p className="text-gray-400 text-sm">
              Total: {questions.length} pergunta{questions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingQuestion(null);
              setShowForm(true);
            }}
            disabled={showForm}
          >
            ➕ Nova Pergunta
          </Button>
        </div>

        {error && (
          <div className="p-4 rounded-md bg-error/10 border border-error/30 text-error">
            {error}
          </div>
        )}

        {/* Formulário de criar/editar */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-halloween-purple">
                <CardContent className="p-6">
                  <QuestionForm
                    initialData={
                      editingQuestion
                        ? {
                            statement: editingQuestion.statement,
                            options: editingQuestion.options,
                            difficulty: editingQuestion.difficulty,
                          }
                        : undefined
                    }
                    onSubmit={editingQuestion ? handleEdit : handleCreate}
                    onCancel={handleCancelForm}
                    isEdit={!!editingQuestion}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de perguntas */}
        {questions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">Nenhuma pergunta cadastrada ainda.</p>
              <Button onClick={() => setShowForm(true)}>
                Criar Primeira Pergunta
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                id={question.id}
                statement={question.statement}
                difficulty={question.difficulty}
                isLocked={question.isLocked}
                onEdit={() => handleEditClick(question)}
                onDelete={() => handleDelete(question.id)}
                showActions={true}
                showQRCode={true}
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
