import { SubmitAnswer } from './SubmitAnswer';
import { IAnswerRepository } from '../../domain/interfaces/IAnswerRepository';
import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';
import { IScoreRepository } from '../../domain/interfaces/IScoreRepository';
import { Question } from '../../domain/entities/Question';
import { Answer } from '../../domain/entities/Answer';

describe('SubmitAnswer UseCase', () => {
  let submitAnswer: SubmitAnswer;
  let mockAnswerRepository: jest.Mocked<IAnswerRepository>;
  let mockQuestionRepository: jest.Mocked<IQuestionRepository>;
  let mockScoreRepository: jest.Mocked<IScoreRepository>;

  beforeEach(() => {
    mockAnswerRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByQuestionId: jest.fn(),
      findByUserAndQuestion: jest.fn(),
      findAll: jest.fn(),
    };

    mockQuestionRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findAvailable: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      lockQuestion: jest.fn(),
      unlockAll: jest.fn(),
    };

    mockScoreRepository = {
      findByUserId: jest.fn(),
      findAll: jest.fn(),
      updateScore: jest.fn(),
      resetAll: jest.fn(),
    };

    submitAnswer = new SubmitAnswer(
      mockAnswerRepository,
      mockQuestionRepository,
      mockScoreRepository
    );
  });

  describe('Successful submission', () => {
    it('should submit correct answer and update score', async () => {
      const question: Question = {
        id: 'q1',
        statement: 'Test question',
        options: [
          { id: 'opt1', text: 'Correct', isCorrect: true },
          { id: 'opt2', text: 'Wrong', isCorrect: false },
        ],
        difficulty: 'easy',
        qrCodeUrl: '/q1',
        isLocked: false,
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const answer: Answer = {
        id: 'a1',
        questionId: 'q1',
        userId: 'u1',
        selectedOptionId: 'opt1',
        isCorrect: true,
        pointsEarned: 10,
        answeredAt: new Date(),
      };

      mockQuestionRepository.findById.mockResolvedValue(question);
      mockAnswerRepository.findByUserAndQuestion.mockResolvedValue(null);
      mockAnswerRepository.create.mockResolvedValue(answer);
      mockQuestionRepository.lockQuestion.mockResolvedValue(true);

      const result = await submitAnswer.execute(
        {
          questionId: 'q1',
          userId: 'u1',
          selectedOptionId: 'opt1',
        },
        'testuser'
      );

      expect(result.isCorrect).toBe(true);
      expect(result.pointsEarned).toBe(10);
      expect(mockScoreRepository.updateScore).toHaveBeenCalledWith('u1', 'testuser', 10, 'easy');
      expect(mockQuestionRepository.lockQuestion).toHaveBeenCalledWith('q1');
    });

    it('should submit wrong answer without updating score', async () => {
      const question: Question = {
        id: 'q1',
        statement: 'Test question',
        options: [
          { id: 'opt1', text: 'Correct', isCorrect: true },
          { id: 'opt2', text: 'Wrong', isCorrect: false },
        ],
        difficulty: 'medium',
        qrCodeUrl: '/q1',
        isLocked: false,
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const answer: Answer = {
        id: 'a1',
        questionId: 'q1',
        userId: 'u1',
        selectedOptionId: 'opt2',
        isCorrect: false,
        pointsEarned: 0,
        answeredAt: new Date(),
      };

      mockQuestionRepository.findById.mockResolvedValue(question);
      mockAnswerRepository.findByUserAndQuestion.mockResolvedValue(null);
      mockAnswerRepository.create.mockResolvedValue(answer);
      mockQuestionRepository.lockQuestion.mockResolvedValue(true);

      const result = await submitAnswer.execute(
        {
          questionId: 'q1',
          userId: 'u1',
          selectedOptionId: 'opt2',
        },
        'testuser'
      );

      expect(result.isCorrect).toBe(false);
      expect(result.pointsEarned).toBe(0);
      expect(mockScoreRepository.updateScore).not.toHaveBeenCalled();
      expect(mockQuestionRepository.lockQuestion).toHaveBeenCalledWith('q1');
    });
  });

  describe('Validation errors', () => {
    it('should throw error if question not found', async () => {
      mockQuestionRepository.findById.mockResolvedValue(null);

      await expect(
        submitAnswer.execute(
          {
            questionId: 'invalid',
            userId: 'u1',
            selectedOptionId: 'opt1',
          },
          'testuser'
        )
      ).rejects.toThrow('Question not found');
    });

    it('should throw error if question is locked', async () => {
      const lockedQuestion: Question = {
        id: 'q1',
        statement: 'Test',
        options: [],
        difficulty: 'easy',
        qrCodeUrl: '/q1',
        isLocked: true,
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockQuestionRepository.findById.mockResolvedValue(lockedQuestion);

      await expect(
        submitAnswer.execute(
          {
            questionId: 'q1',
            userId: 'u1',
            selectedOptionId: 'opt1',
          },
          'testuser'
        )
      ).rejects.toThrow('This question is no longer available');
    });

    it('should throw error if user already answered', async () => {
      const question: Question = {
        id: 'q1',
        statement: 'Test',
        options: [],
        difficulty: 'easy',
        qrCodeUrl: '/q1',
        isLocked: false,
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const existingAnswer: Answer = {
        id: 'a1',
        questionId: 'q1',
        userId: 'u1',
        selectedOptionId: 'opt1',
        isCorrect: true,
        pointsEarned: 10,
        answeredAt: new Date(),
      };

      mockQuestionRepository.findById.mockResolvedValue(question);
      mockAnswerRepository.findByUserAndQuestion.mockResolvedValue(existingAnswer);

      await expect(
        submitAnswer.execute(
          {
            questionId: 'q1',
            userId: 'u1',
            selectedOptionId: 'opt1',
          },
          'testuser'
        )
      ).rejects.toThrow('You have already answered this question');
    });
  });
});
