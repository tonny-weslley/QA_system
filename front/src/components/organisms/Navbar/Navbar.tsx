import { HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../../atoms/Button';
import { Badge } from '../../atoms/Badge';

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  username: string;
  isAdmin?: boolean;
  onScoreboardClick?: () => void;
  onAdminClick?: () => void;
  onLogout?: () => void;
}

export const Navbar = ({
  username,
  isAdmin = false,
  onScoreboardClick,
  onAdminClick,
  onLogout,
  className,
  ...props
}: NavbarProps) => {
  return (
    <nav
      className={cn(
        'border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50',
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-creepster text-halloween-gradient">🎃 Halloween Quiz</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:inline">
              Olá,{' '}
              <span className="text-halloween-purple font-semibold">{username}</span>
              {isAdmin && <Badge variant="default" className="ml-2">Admin</Badge>}
            </span>
            
            {onScoreboardClick && (
              <Button variant="ghost" size="sm" onClick={onScoreboardClick}>
                <span className="hidden sm:inline">🏆 Ranking</span>
                <span className="sm:hidden">🏆</span>
              </Button>
            )}
            
            {isAdmin && onAdminClick && (
              <Button variant="secondary" size="sm" onClick={onAdminClick}>
                <span className="hidden sm:inline">⚙️ Admin</span>
                <span className="sm:hidden">⚙️</span>
              </Button>
            )}
            
            {onLogout && (
              <Button variant="danger" size="sm" onClick={onLogout}>
                <span className="hidden sm:inline">Sair</span>
                <span className="sm:hidden">🚪</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
