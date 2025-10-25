import { useState, useEffect } from 'react';
import { configApi } from '../../../lib/api/config';
import { Card, CardContent, CardHeader, CardTitle } from '../../molecules/Card';
import { Button } from '../../atoms/Button';

export const QuestionsVisibilityControl = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const configs = await configApi.getAll();
      setIsVisible(configs['questions.visible'] as boolean);
    } catch (err) {
      console.error('Erro ao carregar configuração:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async () => {
    setIsSaving(true);
    try {
      const newVisibility = !isVisible;
      
      // Atualizar a configuração global
      await configApi.update('questions.visible', newVisibility);
      
      // Atualizar visibilidade de TODAS as perguntas
      const response = await fetch('/api/questions/visibility/all', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ visible: newVisibility })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar perguntas');
      }

      const result = await response.json();
      
      setIsVisible(newVisibility);
      alert(`Visualização ${newVisibility ? 'habilitada' : 'desabilitada'} com sucesso! ${result.updated} perguntas atualizadas.`);
    } catch (err) {
      alert('Erro ao atualizar configuração');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-400">Carregando...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isVisible ? 'border-green-500/50' : 'border-red-500/50'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isVisible ? '👁️' : '🚫'} Visualização de Perguntas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                Status: {isVisible ? (
                  <span className="text-green-500">Habilitada</span>
                ) : (
                  <span className="text-red-500">Desabilitada</span>
                )}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {isVisible 
                  ? 'Participantes podem ver a lista de perguntas'
                  : 'Participantes só podem acessar perguntas via QR Code'
                }
              </p>
            </div>
            <Button
              onClick={handleToggle}
              isLoading={isSaving}
              variant={isVisible ? 'danger' : 'primary'}
            >
              {isVisible ? 'Desabilitar' : 'Habilitar'}
            </Button>
          </div>

          <div className="p-4 rounded-md bg-halloween-purple/10 border border-halloween-purple/30">
            <p className="text-sm text-gray-300">
              <strong>ℹ️ Como funciona:</strong>
            </p>
            <ul className="text-sm text-gray-400 mt-2 space-y-1 list-disc list-inside">
              <li>
                <strong>Habilitada:</strong> Participantes veem todas as perguntas no painel
              </li>
              <li>
                <strong>Desabilitada:</strong> Participantes veem apenas o ranking e podem escanear QR Codes para acessar perguntas específicas
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
