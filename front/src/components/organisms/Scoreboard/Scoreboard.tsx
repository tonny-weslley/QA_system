import type { HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';
import { ScoreCard } from '../../molecules/ScoreCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../molecules/Card';

export interface ScoreEntry {
  rank: number;
  username: string;
  totalPoints: number;
  easyPoints?: number;
  mediumPoints?: number;
  hardPoints?: number;
}

export interface ScoreboardProps extends HTMLAttributes<HTMLDivElement> {
  scores: ScoreEntry[];
  currentUsername?: string;
  showDetails?: boolean;
  title?: string;
}

export const Scoreboard = ({
  scores,
  currentUsername,
  showDetails = false,
  title = 'Classificação Geral',
  className,
  ...props
}: ScoreboardProps) => {
  if (scores.length === 0) {
    return (
      <Card className={cn('w-full', className)} {...props}>
        <CardContent className="text-center py-12">
          <p className="text-gray-400 text-lg">Nenhuma pontuação registrada ainda.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {scores.map((entry) => (
            <ScoreCard
              key={entry.username}
              rank={entry.rank}
              username={entry.username}
              totalPoints={entry.totalPoints}
              easyPoints={entry.easyPoints}
              mediumPoints={entry.mediumPoints}
              hardPoints={entry.hardPoints}
              isCurrentUser={entry.username === currentUsername}
              showDetails={showDetails}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
