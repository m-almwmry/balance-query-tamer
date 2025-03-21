
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  glass?: boolean;
  hoverEffect?: boolean;
  rtl?: boolean;
}

const AnimatedCard = ({
  children,
  className,
  delay = 0,
  glass = false,
  hoverEffect = true,
  rtl = true,
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
        glass ? 'bg-background/80 backdrop-blur-sm' : 'bg-card text-card-foreground',
        hoverEffect && 'transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]',
        rtl && 'text-right',
        className
      )}
      dir={rtl ? "rtl" : "ltr"}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
