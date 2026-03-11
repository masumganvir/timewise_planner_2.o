import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import DesktopSidebar from './DesktopSidebar';

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Animated background */}
      <div className="animated-bg" />
      
      {/* Floating particles */}
      <div className="floating-particles">
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
      </div>

      <DesktopSidebar />
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto relative z-10">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
