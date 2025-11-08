import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const GlassCard = ({ children, className, hover = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
      className={cn(
        'backdrop-blur-lg bg-white/10 rounded-3xl border border-white/20',
        'shadow-2xl hover:shadow-[0_8px_32px_rgba(122,211,232,0.3)]',
        'hover:bg-white/15 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const GlassButton = ({ children, className, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-primary/80 hover:bg-primary text-white backdrop-blur-md',
    secondary: 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/30',
    accent: 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white backdrop-blur-md'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'px-6 py-3 rounded-full font-semibold',
        'shadow-lg hover:shadow-xl transition-all duration-300',
        'relative overflow-hidden group',
        variants[variant],
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
};

export const GlassSection = ({ children, className, id, ...props }) => {
  return (
    <section
      id={id}
      className={cn(
        'min-h-screen w-full flex items-center justify-center',
        'scroll-snap-align-start',
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};
