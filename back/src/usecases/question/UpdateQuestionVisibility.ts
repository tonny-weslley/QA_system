import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';

export class UpdateQuestionVisibility {
  constructor(private questionRepository: IQuestionRepository) {}

  async execute(questionId: string, visible: boolean): Promise<boolean> {
    // Verificar se a pergunta existe
    const question = await this.questionRepository.findById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    // Atualizar visibilidade
    const updated = await this.questionRepository.updateVisibility(questionId, visible);
    
    if (!updated) {
      throw new Error('Failed to update question visibility');
    }

    return true;
  }
}
