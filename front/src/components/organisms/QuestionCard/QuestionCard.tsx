import { HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../../molecules/Card';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { QRCodeDisplay } from '../../molecules/QRCodeDisplay';

export interface QuestionCardProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  statement: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isLocked?: boolean;
  onAnswer?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  showQRCode?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  id,
  statement,
  difficulty,
  isLocked = false,
  onAnswer,
  onEdit,
  onDelete,
  showActions = true,
  showQRCode = false,
  className,
  ...props
}: QuestionCardProps) => {
  const getDifficultyVariant = () => {
    switch (difficulty) {
      case 'easy':
        return 'easy';
      case 'medium':
        return 'medium';
      case 'hard':
        return 'hard';
      default:
        return 'default';
    }
  };

  return (
    <Card
      className={cn(
        'hover:border-halloween-purple/50 transition-all',
        isLocked && 'opacity-60',
        className
      )}
      {...props}
    >
      <CardHeader>
        <div className="flex justify-between items-start mb-2 gap-2">
          <Badge variant={getDifficultyVariant()}>{difficulty.toUpperCase()}</Badge>
          {isLocked && <Badge variant="error">🔒 Bloqueada</Badge>}
        </div>
        <CardTitle className="text-lg line-clamp-3">{statement}</CardTitle>
      </CardHeader>
      <CardContent>
        {showQRCode && (
          <div className="mb-4">
            <QRCodeDisplay value={id} size={150} />
            <p className="text-xs text-gray-500 text-center mt-2">ID: {id.slice(0, 8)}...</p>
          </div>
        )}
        {showActions && (
          <div className="flex gap-2">
            {onAnswer && (
              <Button
                className="flex-1"
                onClick={onAnswer}
                disabled={isLocked}
                size="sm"
              >
                {isLocked ? 'Bloqueada' : 'Responder'}
              </Button>
            )}
            {onEdit && (
              <Button variant="secondary" onClick={onEdit} size="sm">
                ✏️
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" onClick={onDelete} size="sm">
                🗑️
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
