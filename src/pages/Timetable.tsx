import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useTaskStore } from '@/store/taskStore';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/types/task';

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 9 PM

const Timetable = () => {
  const { tasks, isCompleted } = useTaskStore();
  const today = format(new Date(), 'yyyy-MM-dd');

  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [tasks]
  );

  const getTasksForHour = (hour: number) => {
    return sortedTasks.filter(t => {
      const startH = parseInt(t.startTime.split(':')[0]);
      const endH = parseInt(t.endTime.split(':')[0]);
      return hour >= startH && hour < endH;
    });
  };

  const currentHour = new Date().getHours();

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto page-enter">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display font-bold text-2xl text-foreground">📅 Timetable</h1>
        <p className="text-sm text-muted-foreground">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </motion.div>

      <div className="relative">
        {/* Gradient timeline line */}
        <div className="absolute left-[60px] top-0 bottom-0 w-[2px]" style={{
          background: 'linear-gradient(180deg, hsl(16, 90%, 58%) 0%, hsl(260, 60%, 58%) 50%, hsl(174, 62%, 47%) 100%)',
          opacity: 0.3,
        }} />

        <div className="space-y-0">
          {HOURS.map((hour, idx) => {
            const hourTasks = getTasksForHour(hour);
            const timeStr = `${hour.toString().padStart(2, '0')}:00`;
            const isCurrentHour = currentHour === hour;

            return (
              <motion.div
                key={hour}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03, ease: 'easeOut' }}
                className={`flex gap-4 py-3 relative ${
                  isCurrentHour ? 'bg-primary/[0.06] -mx-4 px-4 rounded-2xl' : ''
                }`}
              >
                {/* Time label */}
                <div className="w-14 flex-shrink-0 text-right relative">
                  <span className={`text-xs font-mono ${isCurrentHour ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                    {timeStr}
                  </span>
                  {/* Timeline dot */}
                  <div className="absolute right-[-22px] top-1/2 -translate-y-1/2">
                    {isCurrentHour ? (
                      <motion.div 
                        className="w-3 h-3 rounded-full gradient-primary time-marker-glow"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
                    )}
                  </div>
                </div>

                {/* Tasks */}
                <div className="flex-1 min-h-[40px] ml-2">
                  {hourTasks.length > 0 ? (
                    <div className="space-y-2">
                      {hourTasks.map(task => {
                        const completed = isCompleted(task.id, today);
                        const categoryColor = CATEGORY_COLORS[task.category];
                        return (
                          <motion.div
                            key={task.id}
                            whileHover={{ scale: 1.02, x: 4 }}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                              completed ? 'opacity-50' : ''
                            }`}
                            style={{
                              backgroundColor: `${categoryColor}12`,
                              borderLeft: `4px solid ${categoryColor}`,
                              color: 'hsl(var(--foreground))',
                              boxShadow: completed ? 'none' : `0 2px 10px ${categoryColor}10`,
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className={completed ? 'line-through text-muted-foreground' : ''}>
                                {task.title}
                              </span>
                              <span 
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{ 
                                  backgroundColor: `${categoryColor}20`,
                                  color: categoryColor 
                                }}
                              >
                                {CATEGORY_LABELS[task.category]}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground mt-1 block">
                              {task.startTime} — {task.endTime}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-px bg-border/20 mt-4" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
