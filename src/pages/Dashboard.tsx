import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Plus, Sparkles, Flame, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '@/store/taskStore';
import { MOTIVATIONAL_QUOTES } from '@/types/task';
import ProgressRing from '@/components/ProgressRing';
import TaskCard from '@/components/TaskCard';
import confetti from 'canvas-confetti';

const Dashboard = () => {
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');
  const { tasks, getDayStats, getStreak, dailyThought, checkAndRefreshThought, fetchNewThought } = useTaskStore();
  const stats = getDayStats(today);
  const streak = getStreak();
  const [prevPercentage, setPrevPercentage] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize AI thought
  useEffect(() => {
    checkAndRefreshThought();
  }, [checkAndRefreshThought]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchNewThought();
    setIsRefreshing(false);
  };

  // Sort tasks by start time
  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [tasks]
  );

  // Confetti on 100%
  useEffect(() => {
    if (stats.percentage === 100 && prevPercentage < 100 && stats.total > 0) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#e85d2f', '#7c3aed', '#14b8a6', '#f59e0b', '#ec4899', '#06b6d4'],
      });
    }
    setPrevPercentage(stats.percentage);
  }, [stats.percentage]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', emoji: '🌅' };
    if (hour < 17) return { text: 'Good Afternoon', emoji: '☀️' };
    return { text: 'Good Evening', emoji: '🌙' };
  };

  const greeting = getGreeting();

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto page-enter">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-muted-foreground text-sm font-medium">{format(new Date(), 'EEEE, MMMM d')}</p>
        <h1 className="text-3xl font-display font-bold text-foreground">
          {greeting.text} <span className="wave-emoji">{greeting.emoji}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Let's make today count!</p>
      </motion.div>

      {/* Quote Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-5 mb-6 gradient-hero text-primary-foreground relative overflow-hidden shimmer group cursor-pointer"
        onClick={handleManualRefresh}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2 blur-xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
        
        <div className="flex justify-between items-start relative z-10 mb-2">
          <Sparkles className={`w-5 h-5 opacity-80 ${isRefreshing ? 'animate-spin' : 'animate-pulse'}`} />
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-md"
          >
            Click to refresh ✨
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={dailyThought?.text || 'loading'}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="relative z-10"
          >
            <p className="text-sm font-medium leading-relaxed italic">
              "{dailyThought?.text || 'Preparing your daily wisdom...'}"
            </p>
            <p className="text-xs mt-2 opacity-75">— {dailyThought?.author || 'TimeWise AI'}</p>
          </motion.div>
        </AnimatePresence>
      </motion.div>


      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-4 mb-6"
      >
        {/* Progress Ring */}
        <motion.div 
          className="glow-card p-4 flex-1 flex flex-col items-center"
          whileHover={{ scale: 1.02 }}
        >
          <ProgressRing percentage={stats.percentage} size={100} strokeWidth={7} />
          <p className="text-xs text-muted-foreground mt-2 font-medium">Today's Progress</p>
        </motion.div>

        {/* Stat Cards */}
        <div className="flex flex-col gap-3 flex-1">
          <motion.div 
            className="glow-card glow-card-accent p-4 flex items-center gap-3"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-md">
              <span className="text-lg font-bold text-accent-foreground">{stats.completed}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-card-foreground stat-number">{stats.completed}/{stats.total}</p>
              <p className="text-xs text-muted-foreground">Tasks Done</p>
            </div>
          </motion.div>

          <motion.div 
            className="glow-card p-4 flex items-center gap-3"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center shadow-md">
              <Flame className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold text-card-foreground stat-number">{streak} days</p>
              <p className="text-xs text-muted-foreground">Current Streak</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Tasks */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Today's Tasks
          </h2>
          <motion.button
            onClick={() => navigate('/add')}
            className="p-2.5 rounded-xl gradient-btn-animated text-primary-foreground pulse-glow"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        {sortedTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glow-card p-8 text-center rainbow-border"
          >
            <div className="text-5xl mb-3 animate-bounce">🎯</div>
            <h3 className="font-display font-semibold text-foreground mb-1 text-lg">No tasks yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Start planning your productive day!</p>
            <motion.button
              onClick={() => navigate('/add')}
              className="px-6 py-3 rounded-xl gradient-btn-animated text-primary-foreground font-semibold text-sm shadow-lg"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              ✨ Add Your First Task
            </motion.button>
          </motion.div>
        ) : (
          <AnimatePresence>
            {sortedTasks.map((task, i) => (
              <TaskCard key={task.id} task={task} date={today} index={i} />
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
