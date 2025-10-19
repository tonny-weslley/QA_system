import type { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { Card, CardContent } from '../../molecules/Card';

export interface PodiumEntry {
  username: string;
  totalPoints: number;
  rank: number;
}

export interface PodiumProps extends HTMLAttributes<HTMLDivElement> {
  topThree: PodiumEntry[];
}

export const Podium = ({ topThree, className, ...props }: PodiumProps) => {
  const getPodiumHeight = (rank: number) => {
    switch (rank) {
      case 1:
        return 'h-48';
      case 2:
        return 'h-36';
      case 3:
        return 'h-28';
      default:
        return 'h-24';
    }
  };

  const getPodiumColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-t from-yellow-600 to-yellow-400';
      case 2:
        return 'bg-gradient-to-t from-gray-600 to-gray-400';
      case 3:
        return 'bg-gradient-to-t from-orange-800 to-orange-600';
      default:
        return 'bg-gray-700';
    }
  };

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '';
    }
  };

  // Ordenar para exibir: 2º, 1º, 3º
  const orderedEntries = [
    topThree.find((e) => e.rank === 2),
    topThree.find((e) => e.rank === 1),
    topThree.find((e) => e.rank === 3),
  ].filter(Boolean) as PodiumEntry[];

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)} {...props}>
      <div className="flex items-end justify-center gap-4 mb-8">
        {orderedEntries.map((entry, index) => (
          <motion.div
            key={entry.username}
            className="flex-1 max-w-xs"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: index * 0.2,
              type: 'spring',
              stiffness: 100,
            }}
          >
            <Card className="mb-2">
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-2">{getMedalEmoji(entry.rank)}</div>
                <p className="font-bold text-lg truncate">{entry.username}</p>
                <p className="text-2xl font-bold text-halloween-orange mt-2">
                  {entry.totalPoints}
                </p>
                <p className="text-xs text-gray-400">pontos</p>
              </CardContent>
            </Card>
            <motion.div
              className={cn(
                'rounded-t-lg flex items-center justify-center text-white font-bold text-2xl',
                getPodiumHeight(entry.rank),
                getPodiumColor(entry.rank)
              )}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                delay: index * 0.2 + 0.3,
                type: 'spring',
                stiffness: 100,
              }}
              style={{ transformOrigin: 'bottom' }}
            >
              {entry.rank}º
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
