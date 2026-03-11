import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, CalendarClock, BarChart3, Settings, Plus, Zap, Sparkles } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/timetable', icon: CalendarClock, label: 'Timetable' },
  { to: '/add', icon: Plus, label: 'Add Task' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const DesktopSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen glass-card border-r border-border rounded-none p-6 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ background: 'linear-gradient(180deg, hsl(16, 90%, 58%), hsl(260, 60%, 58%), hsl(174, 62%, 47%))' }} />
      
      <div className="relative z-10">
        {/* Brand */}
        <motion.div 
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <motion.div 
            className="w-11 h-11 rounded-xl gradient-btn-animated flex items-center justify-center shadow-lg"
            whileHover={{ rotate: 10, scale: 1.1 }}
          >
            <Zap className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <div>
            <h1 className="font-display font-bold text-foreground text-lg leading-tight gradient-text">TimeWise</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Smart Planner
            </p>
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item, i) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? 'gradient-btn-animated text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  }`}
                >
                  {/* Active glow */}
                  {isActive && (
                    <motion.div 
                      className="absolute inset-0 opacity-20"
                      style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.3), transparent)' }}
                      layoutId="sidebarActiveGlow"
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="font-medium text-sm relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebarIndicator"
                      className="absolute right-3 w-1.5 h-6 rounded-full bg-white/40"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </motion.div>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom footer */}
      <div className="mt-auto relative z-10">
        <motion.div 
          className="glass-card p-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-muted-foreground">
            Stay focused. Stay productive. ✨
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">
            v2.0 — Created by MG developers
          </p>
        </motion.div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
