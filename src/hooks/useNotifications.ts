import { useEffect, useCallback, useRef } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { format } from 'date-fns';
import { messaging, requestForToken, onMessageListener } from '@/lib/firebase';
import { toast } from 'sonner';

export const useNotifications = () => {
  const { tasks, notificationsEnabled, dailyReminderTime, notifiedTasks, addNotifiedTask, clearNotifiedTasks } = useTaskStore();

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      await requestForToken();
      return true;
    }
    
    if (Notification.permission === 'denied') return false;

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await requestForToken();
    }
    return permission === 'granted';
  }, []);

  useEffect(() => {
    if (notificationsEnabled) {
      onMessageListener().then((payload: any) => {
        console.log('Foreground Message Received:', payload);
        toast(payload.notification.title, {
          description: payload.notification.body,
        });
      }).catch(err => console.log('failed: ', err));
    }
  }, [notificationsEnabled]);

  const sendNotification = useCallback((title: string, body: string, tag?: string) => {
    if (Notification.permission !== 'granted') return;

    try {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: tag || `timewise-${Date.now()}`,
        requireInteraction: false,
      });
    } catch {
      // Fallback for environments where Notification constructor fails
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            body,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: tag || `timewise-${Date.now()}`,
          });
        });
      }
    }
  }, []);

  const checkAndSendDailyReminder = useCallback(() => {
    if (!notificationsEnabled) return;
    
    const now = new Date();
    const currentTime = format(now, 'HH:mm');
    const today = format(now, 'yyyy-MM-dd');
    const reminderKey = `daily-${today}`;

    if (currentTime === dailyReminderTime && !notifiedTasks.includes(reminderKey)) {
      const activeTasks = tasks.length;
      sendNotification(
        '🌅 Good Morning! Time to be productive!',
        `You have ${activeTasks} task${activeTasks !== 1 ? 's' : ''} planned for today. Let's crush it! 💪`,
        reminderKey
      );
      addNotifiedTask(reminderKey);
    }
  }, [notificationsEnabled, dailyReminderTime, tasks, notifiedTasks, sendNotification, addNotifiedTask]);

  const checkTaskNotifications = useCallback(() => {
    if (!notificationsEnabled) return;

    const now = new Date();
    const currentTime = format(now, 'HH:mm');
    const today = format(now, 'yyyy-MM-dd');

    tasks.forEach((task) => {
      const taskKey = `task-${task.id}-${today}`;
      if (task.startTime === currentTime && !notifiedTasks.includes(taskKey)) {
        sendNotification(
          `⏰ Time for: ${task.title}`,
          task.description || `It's ${task.startTime} — your task "${task.title}" starts now!`,
          taskKey
        );
        addNotifiedTask(taskKey);
      }
    });
  }, [notificationsEnabled, tasks, notifiedTasks, sendNotification, addNotifiedTask]);

  // Clear old notified tasks daily
  const clearOldNotifications = useCallback(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const hasOldEntries = notifiedTasks.some((key) => !key.includes(today));
    if (hasOldEntries) {
      clearNotifiedTasks();
    }
  }, [notifiedTasks, clearNotifiedTasks]);

  return {
    requestPermission,
    sendNotification,
    checkAndSendDailyReminder,
    checkTaskNotifications,
    clearOldNotifications,
    isSupported: 'Notification' in window,
    permission: typeof Notification !== 'undefined' ? Notification.permission : 'denied',
  };
};
