'use client';

import { useEffect, useState } from 'react';

export const useNotifications = (schedule: any[]) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        new Notification('Notifications Enabled! 🔔', {
          body: 'We will remind you when it\'s time for your next protocol step.',
          icon: '/Icon.png'
        });
      }
    }
  };

  useEffect(() => {
    if (permission !== 'granted') return;

    // Check every minute
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      const currentTask = schedule.find(s => s.time === currentTime);

      if (currentTask) {
        // Simple check to ensure we don't spam (browser usually handles duplicate tags)
        new Notification(`Time for: ${currentTask.label} ⏰`, {
          body: currentTask.items.join(', '),
          icon: '/Icon.png',
          tag: currentTask.id, // prevent duplicate notifications for same event
          requireInteraction: true
        });
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [permission, schedule]);

  return { permission, requestPermission };
};
