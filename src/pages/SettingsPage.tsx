import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Bell, Info, Smartphone, Clock, BellRing, Download, Shield, Sparkles, LogOut } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { useNotifications } from '@/hooks/useNotifications';
import { useClerk } from '@clerk/clerk-react';

const SettingsPage = () => {
  const { notificationsEnabled, setNotificationsEnabled, dailyReminderTime, setDailyReminderTime } = useTaskStore();
  const { requestPermission, isSupported, permission } = useNotifications();
  const { signOut } = useClerk();
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallSuccess, setShowInstallSuccess] = useState(false);

  // Capture install prompt
  useState(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  });

  const handleNotificationToggle = async () => {
    if (!notificationsEnabled) {
      const granted = await requestPermission();
      if (granted) {
        setNotificationsEnabled(true);
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setShowInstallSuccess(true);
        setTimeout(() => setShowInstallSuccess(false), 3000);
      }
      setInstallPrompt(null);
    }
  };

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto page-enter">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display font-bold text-2xl text-foreground">⚙️ Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your experience</p>
      </motion.div>

      <div className="space-y-3">
        {/* App Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glow-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <motion.div 
              className="w-12 h-12 rounded-xl gradient-btn-animated flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 15, scale: 1.1 }}
            >
              <Zap className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h2 className="font-display font-bold text-foreground text-lg gradient-text">TimeWise Planner</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Smart Daily Productivity Tracker
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Plan your day, track your progress, and build productive habits. Every task has a purpose — 
            mark them daily as complete and watch your growth over weeks and months.
          </p>
        </motion.div>

        {/* Install PWA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glow-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg gradient-ocean flex items-center justify-center">
                <Smartphone className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <span className="text-sm font-semibold text-foreground">Install App</span>
                <p className="text-xs text-muted-foreground">
                  {isStandalone ? 'Already installed ✅' : 'Add to home screen'}
                </p>
              </div>
            </div>
            {isStandalone ? (
              <span className="text-xs text-green-500 font-semibold px-3 py-1.5 bg-green-500/10 rounded-full flex items-center gap-1">
                <Shield className="w-3 h-3" /> Installed
              </span>
            ) : (
              <motion.button
                onClick={handleInstall}
                whileTap={{ scale: 0.93 }}
                whileHover={{ scale: 1.05 }}
                className="text-xs font-semibold px-4 py-2 rounded-full gradient-primary text-primary-foreground shadow-md flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Install
              </motion.button>
            )}
          </div>
          {showInstallSuccess && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-green-500 mt-2 font-medium"
            >
              🎉 App installed successfully!
            </motion.p>
          )}
        </motion.div>

        {/* Notifications Toggle */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glow-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${notificationsEnabled ? 'gradient-warm' : 'bg-muted'}`}>
                <BellRing className={`w-4.5 h-4.5 ${notificationsEnabled ? 'text-white' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <span className="text-sm font-semibold text-foreground">Notifications</span>
                <p className="text-xs text-muted-foreground">
                  {!isSupported 
                    ? 'Not supported in this browser' 
                    : permission === 'denied' 
                      ? 'Blocked — enable in browser settings'
                      : notificationsEnabled 
                        ? 'Task & daily reminders active' 
                        : 'Get reminders for your tasks'}
                </p>
              </div>
            </div>
            <motion.button
              onClick={handleNotificationToggle}
              disabled={!isSupported || permission === 'denied'}
              whileTap={{ scale: 0.9 }}
              className={`w-12 h-7 rounded-full relative transition-all duration-300 ${
                notificationsEnabled 
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 shadow-md' 
                  : 'bg-muted'
              } ${(!isSupported || permission === 'denied') ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <motion.div
                className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md"
                animate={{ left: notificationsEnabled ? '22px' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Daily Reminder Time */}
        {notificationsEnabled && (
          <motion.div 
            initial={{ opacity: 0, y: 20, height: 0 }} 
            animate={{ opacity: 1, y: 0, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="glow-card p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center">
                  <Clock className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-foreground">Daily Reminder</span>
                  <p className="text-xs text-muted-foreground">Morning motivation alert</p>
                </div>
              </div>
              <input
                type="time"
                value={dailyReminderTime}
                onChange={(e) => setDailyReminderTime(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-muted text-foreground border border-border text-sm font-mono input-glow"
              />
            </div>
          </motion.div>
        )}

        {/* Per-task notifications info */}
        {notificationsEnabled && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="glow-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg gradient-secondary flex items-center justify-center">
                <Bell className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <span className="text-sm font-semibold text-foreground">Task Alerts</span>
                <p className="text-xs text-muted-foreground">
                  You'll get a notification when each task's start time arrives 🔔
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Version */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Version</span>
            </div>
            <span className="text-xs text-muted-foreground font-mono bg-muted px-2.5 py-1 rounded-full">v2.0.0</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="pt-4 pb-8">
          <motion.button
            onClick={() => signOut()}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl border border-red-500/20 text-red-500 font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
