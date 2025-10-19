import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';

export interface AuthLayoutProps {
  children: ReactNode;
  className?: string;
}

export const AuthLayout = ({ children, className }: AuthLayoutProps) => {
  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center p-4',
        'bg-gradient-to-br from-halloween-black via-halloween-purple/20 to-halloween-black',
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
};
