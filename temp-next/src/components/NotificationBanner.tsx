"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationBannerProps {
  message: string;
  type?: "info" | "warning" | "error" | "success";
  onDismiss?: () => void;
}

export function NotificationBanner({ message, type = "info", onDismiss }: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const getBackgroundColor = () => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "success":
        return "bg-green-50 border-green-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div className={`w-full border-b ${getBackgroundColor()} px-4 py-2`}>
      <div className="container mx-auto flex items-center justify-between">
        <p className="text-sm">{message}</p>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
} 