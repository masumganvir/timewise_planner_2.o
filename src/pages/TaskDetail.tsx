import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Calendar, Clock, Target, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { CATEGORY_LABELS, PRIORITY_COLORS } from '@/types/task';
import { format, subDays } from 'date-fns';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, getTaskCompletionHistory, getTaskCompletionRate } = useTaskStore();
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Task not found</p>
        <button onClick={() => navigate('/')} className="mt-4 text-primary underline">Go back</button>
      </div>
    );
  }

  const history = getTaskCompletionHistory(task.id, 14);
  const rate = getTaskCompletionRate(task.id);
  const completedDays = history.filter(h => h.completed).length;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-display font-bold text-2xl text-foreground flex-1">{task.title}</h1>
        <button onClick={() => navigate(`/edit/${task.id}`)} className="p-2 rounded-xl gradient-primary text-primary-foreground">
          <Edit className="w-4 h-4" />
        </button>
      </motion.div>

      <div className="space-y-4">
        {/* Info Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">{task.startTime} - {task.endTime}</span>
            <span className="ml-auto px-2 py-0.5 rounded-full text-xs text-primary-foreground font-medium" style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}>
              {task.priority}
            </span>
          </div>
          <p className="text-sm text-foreground">{task.description || 'No description'}</p>
          <div className="mt-3 text-xs text-muted-foreground">
            {CATEGORY_LABELS[task.category]} • {task.repeat} • Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
          </div>
        </motion.div>

        {/* Deep Reason */}
        {task.reason && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5 gradient-secondary text-secondary-foreground">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4" />
              <span className="font-semibold text-sm">Why This Matters</span>
            </div>
            <p className="text-sm leading-relaxed opacity-90">{task.reason}</p>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-3 gap-3">
          <div className="glass-card p-4 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-primary" />
            <p className="text-xl font-bold font-display text-foreground">{rate}%</p>
            <p className="text-xs text-muted-foreground">Completion</p>
          </div>
          <div className="glass-card p-4 text-center">
            <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-success" />
            <p className="text-xl font-bold font-display text-foreground">{completedDays}</p>
            <p className="text-xs text-muted-foreground">Days Done</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1 text-info" />
            <p className="text-xl font-bold font-display text-foreground">{history.length}</p>
            <p className="text-xs text-muted-foreground">Total Days</p>
          </div>
        </motion.div>

        {/* Completion Heatmap */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-5">
          <h3 className="font-display font-semibold text-foreground mb-3">Last 14 Days</h3>
          <div className="grid grid-cols-7 gap-2">
            {history.map((h, i) => (
              <div key={h.date} className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    h.completed ? 'gradient-primary' : 'bg-muted'
                  }`}
                >
                  {h.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    <XCircle className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <span className="text-[9px] text-muted-foreground">
                  {format(new Date(h.date), 'd')}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notes */}
        {task.notes && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
            <h3 className="font-display font-semibold text-foreground mb-2">📝 Notes</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{task.notes}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;
