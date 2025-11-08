import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  const orbs = [
    { size: 400, x: '10%', y: '20%', color: 'rgba(122, 211, 232, 0.15)', duration: 20 },
    { size: 500, x: '70%', y: '60%', color: 'rgba(74, 124, 140, 0.1)', duration: 25 },
    { size: 300, x: '80%', y: '10%', color: 'rgba(125, 211, 232, 0.12)', duration: 18 },
    { size: 350, x: '20%', y: '70%', color: 'rgba(62, 92, 118, 0.1)', duration: 22 },
    { size: 450, x: '50%', y: '40%', color: 'rgba(164, 211, 238, 0.08)', duration: 30 }
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
          }}
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
    </div>
  );
};

export default AnimatedBackground;
