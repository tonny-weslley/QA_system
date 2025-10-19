import { IAnswerRepository } from '../../domain/interfaces/IAnswerRepository';
import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';
import { IScoreRepository } from '../../domain/interfaces/IScoreRepository';
import { CreateAnswerDTO, AnswerResponse } from '../../domain/entities/Answer';

const POINTS_BY_DIFFICULTY = {
  easy: 10,
  medium: 20,
  hard: 30,
};

export class SubmitAnswer {
  constructor(
    private answerRepository: IAnswerRepository,
    private questionRepository: IQuestionRepository,
    private scoreRepository: IScoreRepository
  ) {}

  async execute(data: CreateAnswerDTO, username: string): Promise<AnswerResponse> {
    // Buscar pergunta
    const question = await this.questionRepository.findById(data.questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    // Verificar se pergunta está bloqueada
    if (question.isLocked) {
      throw new Error('This question is no longer available');
    }

    // Verificar se usuário já respondeu
    const existingAnswer = await this.answerRepository.findByUserAndQuestion(
      data.userId,
      data.questionId
    );
    if (existingAnswer) {
      throw new Error('You have already answered this question');
    }

    // Verificar se opção existe e se está correta
    const selectedOption = question.options.find((opt) => opt.id === data.selectedOptionId);
    if (!selectedOption) {
      throw new Error('Invalid option selected');
    }

    const isCorrect = selectedOption.isCorrect;
    const pointsEarned = isCorrect ? POINTS_BY_DIFFICULTY[question.difficulty] : 0;

    // Criar resposta
    const answer = await this.answerRepository.create({
      questionId: data.questionId,
      userId: data.userId,
      selectedOptionId: data.selectedOptionId,
      isCorrect,
      pointsEarned,
    });

    // Atualizar pontuação se acertou
    if (isCorrect) {
      await this.scoreRepository.updateScore(
        data.userId,
        username,
        pointsEarned,
        question.difficulty
      );
    }

    // Bloquear pergunta após resposta
    await this.questionRepository.lockQuestion(data.questionId);

    // Retornar resposta com indicação de correta
    const correctOption = question.options.find((opt) => opt.isCorrect);

    return {
      id: answer.id,
      questionId: answer.questionId,
      isCorrect: answer.isCorrect,
      pointsEarned: answer.pointsEarned,
      correctOptionId: correctOption?.id,
      answeredAt: answer.answeredAt,
    };
  }
}
