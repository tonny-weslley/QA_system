import { IScoreRepository } from '../../domain/interfaces/IScoreRepository';
import { ScoreboardResponse, ScoreboardEntry, AdminScoreboardEntry } from '../../domain/entities/Score';

export class GetScoreboard {
  constructor(private scoreRepository: IScoreRepository) {}

  async execute(isAdmin: boolean): Promise<ScoreboardResponse> {
    const scores = await this.scoreRepository.findAll();

    // Scoreboard para participantes (apenas totalPoints)
    const participants: ScoreboardEntry[] = scores.map((score, index) => ({
      rank: index + 1,
      username: score.username,
      totalPoints: score.totalPoints,
    }));

    // Scoreboard para admin (com detalhes)
    const adminView: AdminScoreboardEntry[] | undefined = isAdmin
      ? scores.map((score, index) => ({
          rank: index + 1,
          username: score.username,
          totalPoints: score.totalPoints,
          easyPoints: score.easyPoints,
          mediumPoints: score.mediumPoints,
          hardPoints: score.hardPoints,
        }))
      : undefined;

    return {
      participants,
      adminView,
    };
  }
}
