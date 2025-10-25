import { type HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../../molecules/Card';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { QRCodeSVG } from 'qrcode.react';

export interface QuestionCardProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  code?: string;
  statement: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isLocked?: boolean;
  visible?: boolean;
  onAnswer?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleVisibility?: (visible: boolean) => void;
  onToggleLock?: (isLocked: boolean) => void;
  onDownloadQRCode?: () => void;
  showActions?: boolean;
  showQRCode?: boolean;
  showVisibilityToggle?: boolean;
  showLockToggle?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  id: _id,
  code,
  statement,
  difficulty,
  isLocked = false,
  visible = true,
  onAnswer,
  onEdit,
  onDelete,
  onToggleVisibility,
  onToggleLock,
  onDownloadQRCode,
  showActions = true,
  showQRCode = false,
  showVisibilityToggle = false,
  showLockToggle = false,
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
          <div className="flex gap-2 flex-wrap">
            <Badge variant={getDifficultyVariant()}>{difficulty.toUpperCase()}</Badge>
            {isLocked && <Badge variant="error">🔒 Bloqueada</Badge>}
            {!visible && <Badge variant="warning">👁️ Invisível</Badge>}
          </div>
        </div>
        <CardTitle className="text-base sm:text-lg line-clamp-3">{statement}</CardTitle>
      </CardHeader>
      <CardContent>
        {showQRCode && code && (
          <div className="mb-4 flex flex-col items-center">
            <div className="bg-white p-3 rounded-lg">
              <QRCodeSVG 
                value={`${window.location.origin}/questions/${code}`}
                size={128}
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="text-sm font-mono font-bold text-halloween-purple mt-2">{code}</p>
            <p className="text-xs text-gray-500 text-center">Escaneie ou digite o código</p>
          </div>
        )}
        {showVisibilityToggle && onToggleVisibility && (
          <div className="mb-4 p-3 bg-gray-800/50 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {visible ? '👁️ Visível' : '🚫 Invisível'}
                </span>
                <span className="text-xs text-gray-400">
                  {visible ? 'Participantes podem ver' : 'Apenas admins'}
                </span>
              </div>
              <button
                onClick={() => onToggleVisibility(!visible)}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  visible ? 'bg-green-600' : 'bg-gray-600'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    visible ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          </div>
        )}
        {showLockToggle && onToggleLock && (
          <div className="mb-4 p-3 bg-gray-800/50 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {isLocked ? '🔒 Bloqueada' : '🔓 Desbloqueada'}
                </span>
                <span className="text-xs text-gray-400">
                  {isLocked ? 'Não pode ser respondida' : 'Pode ser respondida'}
                </span>
              </div>
              <button
                onClick={() => onToggleLock(!isLocked)}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  isLocked ? 'bg-red-600' : 'bg-green-600'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    isLocked ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
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
            {onDownloadQRCode && (
              <Button variant="secondary" onClick={onDownloadQRCode} size="sm" title="Baixar QR Code">
                📥
              </Button>
            )}
            {onEdit && (
              <Button variant="secondary" onClick={onEdit} size="sm" title="Editar">
                ✏️
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" onClick={onDelete} size="sm" title="Deletar">
                🗑️
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
