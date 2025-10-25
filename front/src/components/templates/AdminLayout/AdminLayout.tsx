import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { Navbar } from '../../organisms/Navbar';

export interface AdminLayoutProps {
  children: ReactNode;
  username: string;
  onQuestionsClick?: () => void;
  onScoreboardClick?: () => void;
  onLogout?: () => void;
  className?: string;
}

export const AdminLayout = ({
  children,
  username,
  onQuestionsClick: _onQuestionsClick,
  onScoreboardClick,
  onLogout,
  className,
}: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-halloween-black via-halloween-purple/10 to-halloween-black">
      <Navbar
        username={username}
        isAdmin={true}
        onScoreboardClick={onScoreboardClick}
        onLogout={onLogout}
      />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn('max-w-7xl mx-auto px-4 py-8', className)}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-creepster text-halloween-gradient mb-2">
            ⚙️ Painel Administrativo
          </h1>
          <p className="text-gray-400">Gerencie o quiz e visualize estatísticas</p>
        </div>
        {children}
      </motion.main>
    </div>
  );
};
