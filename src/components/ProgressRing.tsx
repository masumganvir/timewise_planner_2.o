import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const ProgressRing = ({ percentage, size = 120, strokeWidth = 8, className = '' }: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  // Animated counter
  const [displayPercentage, setDisplayPercentage] = useState(0);
  useEffect(() => {
    const duration = 1200;
    const start = Date.now();
    const from = 0;
    const to = percentage;
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayPercentage(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [percentage]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Outer glow */}
      <div 
        className="absolute inset-0 rounded-full blur-xl opacity-20"
        style={{
          background: `conic-gradient(hsl(16, 90%, 58%) ${percentage}%, transparent ${percentage}%)`,
        }}
      />
      
      <svg width={size} height={size} className="progress-ring relative z-10">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          opacity={0.5}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth + 1}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 6px rgba(232, 93, 47, 0.4))' }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(16, 90%, 58%)" />
            <stop offset="50%" stopColor="hsl(340, 80%, 55%)" />
            <stop offset="100%" stopColor="hsl(260, 60%, 58%)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-bold font-display text-foreground stat-number"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          {displayPercentage}%
        </motion.span>
        <span className="text-xs text-muted-foreground font-medium">done</span>
      </div>
    </div>
  );
};

export default ProgressRing;
