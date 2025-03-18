
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  glass?: boolean;
  hoverEffect?: boolean;
}

const AnimatedCard = ({
  children,
  className,
  delay = 0,
  glass = false,
  hoverEffect = true,
}: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: delay * 0.1,
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={cn(
        'rounded-xl border border-border p-6',
        glass ? 'glass' : 'bg-card text-card-foreground',
        hoverEffect && 'transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
