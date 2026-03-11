import { motion } from 'framer-motion';
import { Check, Circle, Clock, Trash2, ChevronRight, Sparkles } from 'lucide-react';
import { Task, CATEGORY_COLORS, CATEGORY_LABELS, PRIORITY_COLORS } from '@/types/task';
import { useTaskStore } from '@/store/taskStore';
import { useNavigate } from 'react-router-dom';

interface TaskCardProps {
  task: Task;
  date: string;
  index?: number;
}

const TaskCard = ({ task, date, index = 0 }: TaskCardProps) => {
  const { toggleCompletion, isCompleted, deleteTask } = useTaskStore();
  const navigate = useNavigate();
  const completed = isCompleted(task.id, date);
  const categoryColor = CATEGORY_COLORS[task.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: 'easeOut' }}
      className={`glow-card p-4 mb-3 cursor-pointer transition-all duration-300 relative overflow-hidden ${
        completed ? 'opacity-60' : ''
      }`}
      style={{
        borderLeft: `4px solid ${categoryColor}`,
        boxShadow: completed ? undefined : `0 0 12px ${categoryColor}15`,
      }}
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Subtle category color glow overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] rounded-lg pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${categoryColor}, transparent)` }}
      />

      <div className="flex items-start gap-3 relative z-10">
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            toggleCompletion(task.id, date);
          }}
          className="mt-1 flex-shrink-0"
          whileTap={{ scale: 0.7 }}
        >
          {completed ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shadow-md"
              style={{ boxShadow: `0 2px 12px ${categoryColor}60` }}
            >
              <Check className="w-4 h-4 text-primary-foreground" />
            </motion.div>
          ) : (
            <div className="w-7 h-7 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center hover:border-primary transition-colors">
              <Circle className="w-4 h-4 text-transparent" />
            </div>
          )}
        </motion.button>

        <div className="flex-1 min-w-0" onClick={() => navigate(`/task/${task.id}`)}>
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold text-card-foreground truncate ${completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
            {completed && <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />}
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm"
              style={{ 
                backgroundColor: PRIORITY_COLORS[task.priority],
                boxShadow: `0 0 6px ${PRIORITY_COLORS[task.priority]}50` 
              }}
            />
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{task.description}</p>
          )}

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {task.startTime} - {task.endTime}
            </span>
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide"
              style={{ 
                backgroundColor: `${categoryColor}18`,
                color: categoryColor,
                border: `1px solid ${categoryColor}25`
              }}
            >
              {CATEGORY_LABELS[task.category]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id);
            }}
            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={() => navigate(`/task/${task.id}`)}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
            whileHover={{ x: 3 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
