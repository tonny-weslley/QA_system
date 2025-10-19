import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { Navbar } from '../../organisms/Navbar';

export interface MainLayoutProps {
  children: ReactNode;
  username: string;
  isAdmin?: boolean;
  onScoreboardClick?: () => void;
  onAdminClick?: () => void;
  onLogout?: () => void;
  className?: string;
}

export const MainLayout = ({
  children,
  username,
  isAdmin,
  onScoreboardClick,
  onAdminClick,
  onLogout,
  className,
}: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-halloween-black via-halloween-purple/10 to-halloween-black">
      <Navbar
        username={username}
        isAdmin={isAdmin}
        onScoreboardClick={onScoreboardClick}
        onAdminClick={onAdminClick}
        onLogout={onLogout}
      />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn('max-w-7xl mx-auto px-4 py-8', className)}
      >
        {children}
      </motion.main>
    </div>
  );
};
