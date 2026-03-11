import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, CalendarClock, BarChart3, Settings, Plus } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/timetable', icon: CalendarClock, label: 'Schedule' },
  { to: '/add', icon: Plus, label: 'Add', isCenter: true },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="frosted-nav rounded-none px-2 pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;

            if (item.isCenter) {
              return (
                <NavLink key={item.to} to={item.to} className="relative -mt-7">
                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.1 }}
                    className="w-14 h-14 rounded-full gradient-btn-animated flex items-center justify-center shadow-lg pulse-glow"
                  >
                    <Plus className="w-6 h-6 text-primary-foreground" />
                  </motion.div>
                </NavLink>
              );
            }

            return (
              <NavLink key={item.to} to={item.to} className="flex flex-col items-center gap-0.5 px-3 py-1">
                <div className="relative">
                  <motion.div
                    whileTap={{ scale: 0.8 }}
                    className="relative"
                  >
                    <Icon
                      className={`w-5 h-5 transition-all duration-300 ${
                        isActive ? 'text-primary drop-shadow-md' : 'text-muted-foreground'
                      }`}
                    />
                  </motion.div>
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full nav-pill"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </div>
                <span className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
