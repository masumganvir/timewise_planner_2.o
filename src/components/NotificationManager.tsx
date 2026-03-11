import { useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { useTaskStore } from '@/store/taskStore';

const NotificationManager = () => {
  const { notificationsEnabled } = useTaskStore();
  const { checkAndSendDailyReminder, checkTaskNotifications, clearOldNotifications } = useNotifications();

  useEffect(() => {
    if (!notificationsEnabled) return;

    // Initial check
    clearOldNotifications();
    checkAndSendDailyReminder();
    checkTaskNotifications();

    // Check every 30 seconds
    const interval = setInterval(() => {
      checkAndSendDailyReminder();
      checkTaskNotifications();
    }, 30000);

    // Clear old notified tasks at midnight
    const midnightCheck = setInterval(() => {
      clearOldNotifications();
    }, 60000 * 60); // Every hour

    return () => {
      clearInterval(interval);
      clearInterval(midnightCheck);
    };
  }, [notificationsEnabled, checkAndSendDailyReminder, checkTaskNotifications, clearOldNotifications]);

  return null; // This is a background component
};

export default NotificationManager;
