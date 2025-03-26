import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  index?: number;
  variant?: 'default' | 'glass' | 'solid' | 'outline';
}

const AnimatedCard = ({ 
  children, 
  className, 
  delay = 0, 
  index = 0,
  variant = 'default',
  ...props 
}: AnimatedCardProps) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: delay || index * 0.1,
      }
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      className={cn(
        'rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg',
        variant === 'glass' && 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20 dark:border-gray-700/20',
        variant === 'solid' && 'bg-card shadow-md',
        variant === 'outline' && 'border bg-card/50',
        variant === 'default' && 'bg-card/70 backdrop-blur-sm shadow-sm border',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
