import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { Category, Priority, RepeatType, CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/task';

const categories: Category[] = ['work', 'study', 'health', 'personal', 'fitness', 'creative', 'social', 'other'];
const priorities: Priority[] = ['low', 'medium', 'high', 'critical'];
const repeatOptions: RepeatType[] = ['none', 'daily', 'weekly', 'custom'];

const priorityLabels: Record<Priority, string> = { low: '🟢 Low', medium: '🟡 Medium', high: '🟠 High', critical: '🔴 Critical' };
const priorityColors: Record<Priority, string> = { low: '#22c55e', medium: '#eab308', high: '#f97316', critical: '#ef4444' };
const repeatLabels: Record<RepeatType, string> = { none: 'Once', daily: 'Daily', weekly: 'Weekly', custom: 'Custom' };

const AddTask = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { tasks, addTask, updateTask } = useTaskStore();
  const existingTask = id ? tasks.find(t => t.id === id) : undefined;

  const [title, setTitle] = useState(existingTask?.title || '');
  const [description, setDescription] = useState(existingTask?.description || '');
  const [reason, setReason] = useState(existingTask?.reason || '');
  const [category, setCategory] = useState<Category>(existingTask?.category || 'work');
  const [priority, setPriority] = useState<Priority>(existingTask?.priority || 'medium');
  const [startTime, setStartTime] = useState(existingTask?.startTime || '09:00');
  const [endTime, setEndTime] = useState(existingTask?.endTime || '10:00');
  const [repeat, setRepeat] = useState<RepeatType>(existingTask?.repeat || 'daily');
  const [notes, setNotes] = useState(existingTask?.notes || '');

  const handleSubmit = () => {
    if (!title.trim()) return;
    const data = { title, description, reason, category, priority, startTime, endTime, repeat, notes };
    if (existingTask) {
      updateTask(existingTask.id, data);
    } else {
      addTask(data);
    }
    navigate(-1);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-muted/50 text-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 input-glow transition-all text-sm backdrop-blur-sm";
  const labelClass = "text-sm font-semibold text-foreground mb-1.5 block";

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto page-enter">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
        <motion.button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-xl hover:bg-muted/60 transition-all"
          whileTap={{ scale: 0.9 }}
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            {existingTask ? '✏️ Edit Task' : '✨ New Task'}
          </h1>
          <p className="text-xs text-muted-foreground">Fill in the details below</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-5">
        {/* Title */}
        <motion.div whileFocus={{ scale: 1.01 }}>
          <label className={labelClass}>Task Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Morning workout 💪" className={inputClass} />
        </motion.div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What does this task involve?" rows={2} className={inputClass} />
        </div>

        {/* Reason */}
        <div>
          <label className={labelClass}>🎯 Why This Matters</label>
          <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Why is this task important to you?" rows={2} className={inputClass} />
        </div>

        {/* Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>⏰ Start Time</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>⏰ End Time</label>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className={inputClass} />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className={labelClass}>📂 Category</label>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((c, i) => (
              <motion.button
                key={c}
                onClick={() => setCategory(c)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.03 }}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  category === c 
                    ? 'text-white shadow-lg' 
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground border border-border/30'
                }`}
                style={category === c ? { 
                  backgroundColor: CATEGORY_COLORS[c],
                  boxShadow: `0 4px 15px ${CATEGORY_COLORS[c]}40`
                } : {}}
              >
                {CATEGORY_LABELS[c]}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className={labelClass}>🚦 Priority</label>
          <div className="grid grid-cols-4 gap-2">
            {priorities.map((p, i) => (
              <motion.button
                key={p}
                onClick={() => setPriority(p)}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  priority === p 
                    ? 'text-white shadow-lg' 
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground border border-border/30'
                }`}
                style={priority === p ? { 
                  backgroundColor: priorityColors[p],
                  boxShadow: `0 4px 15px ${priorityColors[p]}40`
                } : {}}
              >
                {priorityLabels[p]}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Repeat */}
        <div>
          <label className={labelClass}>🔄 Repeat</label>
          <div className="grid grid-cols-4 gap-2">
            {repeatOptions.map(r => (
              <motion.button
                key={r}
                onClick={() => setRepeat(r)}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  repeat === r ? 'gradient-accent text-accent-foreground shadow-lg' : 'bg-muted/50 text-muted-foreground hover:text-foreground border border-border/30'
                }`}
              >
                {repeatLabels[r]}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className={labelClass}>📝 Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes..." rows={2} className={inputClass} />
        </div>

        {/* Submit */}
        <motion.button
          onClick={handleSubmit}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          disabled={!title.trim()}
          className="w-full py-4 rounded-xl gradient-btn-animated text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 transition-opacity"
          style={{ boxShadow: '0 8px 30px rgba(232, 93, 47, 0.35)' }}
        >
          <Sparkles className="w-5 h-5" />
          {existingTask ? 'Update Task' : 'Create Task'}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AddTask;
