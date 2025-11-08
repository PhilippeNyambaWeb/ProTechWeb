import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const GlassCard = ({ children, className, hover = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
      className={cn(
        'backdrop-blur-lg bg-white/15 rounded-3xl border border-white/30',
        'shadow-2xl hover:shadow-[0_8px_32px_rgba(122,211,232,0.4)]',
        'hover:bg-white/20 transition-all duration-300',
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
    primary: 'bg-transparent hover:bg-white/10 text-white border-2 border-secondary hover:border-white',
    secondary: 'bg-transparent hover:bg-white/10 text-white border-2 border-white/60 hover:border-white',
    accent: 'bg-transparent hover:bg-secondary/20 text-white border-2 border-secondary hover:border-secondary'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'px-6 py-3 rounded-full font-bold text-white',
        'hover:shadow-lg transition-all duration-300',
        'relative overflow-hidden group',
        variants[variant],
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3 }}
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
