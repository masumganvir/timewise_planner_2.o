import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
import { useTaskStore } from '@/store/taskStore';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';
import { TrendingUp, Target, Flame, Award } from 'lucide-react';

const AnimatedNumber = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1000;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [value]);
  return <span className="stat-number">{display}{suffix}</span>;
};

const Analytics = () => {
  const { getDayStats, getWeekStats, getMonthStats, getStreak, tasks } = useTaskStore();
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayStats = getDayStats(today);
  const weekStats = getWeekStats(today);
  const streak = getStreak();

  const weekChartData = useMemo(() => {
    return weekStats.map(s => ({
      day: format(new Date(s.date), 'EEE'),
      completed: s.completed,
      total: s.total,
      percentage: s.percentage,
    }));
  }, [weekStats]);

  const monthTrend = useMemo(() => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const stats = getDayStats(date);
      data.push({
        date: format(new Date(date), 'MMM d'),
        percentage: stats.percentage,
      });
    }
    return data;
  }, [getDayStats]);

  const weeklyAvg = useMemo(() => {
    const total = weekStats.reduce((acc, s) => acc + s.percentage, 0);
    return Math.round(total / 7);
  }, [weekStats]);

  const monthlyStats = getMonthStats(today);
  const monthlyAvg = useMemo(() => {
    const validDays = monthlyStats.filter(s => s.total > 0);
    if (validDays.length === 0) return 0;
    return Math.round(validDays.reduce((acc, s) => acc + s.percentage, 0) / validDays.length);
  }, [monthlyStats]);

  const statCards = [
    { icon: Target, label: 'Today', value: todayStats.percentage, suffix: '%', gradient: 'gradient-primary', shadow: 'rgba(232, 93, 47, 0.3)' },
    { icon: TrendingUp, label: 'Weekly Avg', value: weeklyAvg, suffix: '%', gradient: 'gradient-secondary', shadow: 'rgba(124, 58, 237, 0.3)' },
    { icon: Award, label: 'Monthly Avg', value: monthlyAvg, suffix: '%', gradient: 'gradient-accent', shadow: 'rgba(20, 184, 166, 0.3)' },
    { icon: Flame, label: 'Streak', value: streak, suffix: ' days', gradient: 'gradient-warm', shadow: 'rgba(245, 158, 11, 0.3)' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto page-enter">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display font-bold text-2xl text-foreground">📊 Analytics</h1>
        <p className="text-sm text-muted-foreground">Track your productivity journey</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.04, y: -3 }}
            className={`glass-card p-4 ${card.gradient} text-primary-foreground relative overflow-hidden shimmer`}
            style={{ boxShadow: `0 8px 25px ${card.shadow}` }}
          >
            <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
            <card.icon className="w-5 h-5 mb-2 opacity-90" />
            <p className="text-2xl font-bold font-display">
              <AnimatedNumber value={card.value} suffix={card.suffix} />
            </p>
            <p className="text-xs opacity-80 font-medium">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Weekly Bar Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }} 
        className="glow-card glow-card-secondary p-5 mb-4"
      >
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full gradient-secondary" />
          This Week
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weekChartData}>
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
              }}
            />
            <Bar dataKey="completed" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="total" fill="hsl(var(--muted))" radius={[6, 6, 0, 0]} opacity={0.5} />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(16, 90%, 58%)" />
                <stop offset="100%" stopColor="hsl(340, 80%, 55%)" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Monthly Trend */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4 }} 
        className="glow-card p-5 mb-4"
      >
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full gradient-accent" />
          30-Day Trend
        </h3>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={monthTrend}>
            <defs>
              <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(260, 60%, 58%)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="hsl(260, 60%, 58%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(260, 60%, 58%)" />
                <stop offset="100%" stopColor="hsl(174, 62%, 47%)" />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} interval={6} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
              }}
            />
            <Area type="monotone" dataKey="percentage" stroke="url(#lineGradient)" fill="url(#colorPercentage)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Monthly Heatmap */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glow-card glow-card-accent p-5">
        <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full gradient-primary" />
          This Month Heatmap
        </h3>
        <div className="grid grid-cols-7 gap-1.5">
          {monthlyStats.map((s, i) => {
            const opacity = s.total === 0 ? 0.08 : Math.max(0.15, s.percentage / 100);
            return (
              <motion.div
                key={s.date}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.02 }}
                className="aspect-square rounded-lg flex items-center justify-center text-[9px] font-bold cursor-pointer transition-transform hover:scale-110"
                style={{
                  backgroundColor: `hsla(16, 90%, 58%, ${opacity})`,
                  color: s.percentage > 50 ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                  boxShadow: s.percentage > 70 ? `0 0 8px hsla(16, 90%, 58%, 0.3)` : 'none',
                }}
                title={`${format(new Date(s.date), 'MMM d')}: ${s.percentage}%`}
              >
                {format(new Date(s.date), 'd')}
              </motion.div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-3 justify-end text-xs text-muted-foreground">
          <span>Less</span>
          {[0.12, 0.3, 0.5, 0.75, 1].map(o => (
            <div key={o} className="w-3.5 h-3.5 rounded-md transition-transform hover:scale-125" style={{ backgroundColor: `hsla(16, 90%, 58%, ${o})` }} />
          ))}
          <span>More</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
