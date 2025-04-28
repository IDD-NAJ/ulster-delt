"use client";

import { NotificationBanner } from "@/components/NotificationBanner";
import { useNotifications } from "@/hooks/useNotifications";

export function Notifications() {
  const { notifications, isLoading, error } = useNotifications();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mt-8">
      {notifications.map((notification) => (
        <NotificationBanner
          key={notification.id}
          message={notification.message}
          type={notification.type}
        />
      ))}
    </div>
  );
} 