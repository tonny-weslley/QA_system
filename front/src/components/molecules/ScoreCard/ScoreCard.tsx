import { HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';
import { Card, CardContent } from '../Card';

export interface ScoreCardProps extends HTMLAttributes<HTMLDivElement> {
  rank: number;
  username: string;
  totalPoints: number;
  easyPoints?: number;
  mediumPoints?: number;
  hardPoints?: number;
  isCurrentUser?: boolean;
  showDetails?: boolean;
}

export const ScoreCard = ({
  rank,
  username,
  totalPoints,
  easyPoints,
  mediumPoints,
  hardPoints,
  isCurrentUser = false,
  showDetails = false,
  className,
  ...props
}: ScoreCardProps) => {
  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `${rank}º`;
    }
  };

  return (
    <Card
      className={cn(
        'transition-all hover:scale-[1.02]',
        isCurrentUser && 'border-halloween-purple bg-halloween-purple/10',
        className
      )}
      {...props}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <span className="text-2xl font-bold w-12 text-center">{getMedalEmoji(rank)}</span>
            <div className="flex-1">
              <p className="font-semibold text-lg">
                {username}
                {isCurrentUser && (
                  <span className="ml-2 text-xs text-halloween-orange">(Você)</span>
                )}
              </p>
              {showDetails && (easyPoints !== undefined || mediumPoints !== undefined || hardPoints !== undefined) && (
                <div className="flex gap-3 mt-1 text-xs text-gray-400">
                  {easyPoints !== undefined && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      {easyPoints}
                    </span>
                  )}
                  {mediumPoints !== undefined && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-halloween-orange"></span>
                      {mediumPoints}
                    </span>
                  )}
                  {hardPoints !== undefined && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      {hardPoints}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-halloween-orange">{totalPoints}</p>
            <p className="text-xs text-gray-400">pontos</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
