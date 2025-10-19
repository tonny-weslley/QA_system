export interface Score {
  userId: string;
  username: string;
  easyPoints: number;
  mediumPoints: number;
  hardPoints: number;
  totalPoints: number;
  updatedAt: Date;
}

export interface ScoreboardEntry {
  rank: number;
  username: string;
  totalPoints: number;
}

export interface AdminScoreboardEntry extends ScoreboardEntry {
  easyPoints: number;
  mediumPoints: number;
  hardPoints: number;
}

export interface ScoreboardResponse {
  participants: ScoreboardEntry[];
  adminView?: AdminScoreboardEntry[];
}
