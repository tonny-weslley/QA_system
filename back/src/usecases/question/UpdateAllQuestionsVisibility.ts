import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';

export class UpdateAllQuestionsVisibility {
  constructor(private questionRepository: IQuestionRepository) {}

  async execute(visible: boolean): Promise<{ updated: number }> {
    const questions = await this.questionRepository.findAll();
    
    let updated = 0;
    for (const question of questions) {
      await this.questionRepository.update(question.id, { visible });
      updated++;
    }

    return { updated };
  }
}
